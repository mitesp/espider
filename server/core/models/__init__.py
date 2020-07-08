from django.core.exceptions import ValidationError
from django.db import models

from .users import *  # noqa
from .users import ESPUser


class RegStatusOptions(models.TextChoices):
    CLASS_PREFERENCES = ("CLASS_PREFERENCES",)
    FROZEN_PREFERENCES = ("FROZEN_PREFERENCES",)
    CHANGE_CLASSES = ("CHANGE_CLASSES",)
    PRE_PROGRAM = ("PRE_PROGRAM",)
    DAY_OF = ("DAY_OF",)
    POST_PROGRAM = ("POST_PROGRAM",)


# TODO move static methods to managers


class Program(models.Model):
    name = models.CharField(max_length=200)  # TODO maybe this should be a constant set
    edition = models.CharField(max_length=200)  # this is (season +) year
    student_reg_open = models.BooleanField(default=False)
    student_reg_status = models.CharField(
        max_length=20, choices=RegStatusOptions.choices, default=RegStatusOptions.CLASS_PREFERENCES
    )
    teacher_reg_open = models.BooleanField(default=False)

    @property
    def url(self):
        return self.name + "/" + self.edition  # TODO handle multi-word editions/seasons

    def __str__(self):
        return self.name + " " + self.edition

    @staticmethod
    def get_open_student_programs():
        return Program.objects.all().filter(student_reg_open=True)

    @staticmethod
    def get_previous_student_programs(user):
        """
        Get programs for which a student has a studentreg object and the program is over
        """
        studentregs = StudentRegistration.objects.filter(student=user)

        previous_program_ids = studentregs.filter(
            reg_status=RegStatusOptions.POST_PROGRAM
        ).values_list("program", flat=True)
        previous_programs = Program.objects.filter(
            id__in=previous_program_ids, student_reg_open=False
        )
        return previous_programs

    @staticmethod
    def get_current_student_programs(user):
        studentregs = StudentRegistration.objects.filter(student=user)
        current_studentregs = studentregs.exclude(
            reg_status=RegStatusOptions.POST_PROGRAM
        ).values_list("program", flat=True)
        current_programs = Program.objects.filter(id__in=current_studentregs)
        return current_programs

    @staticmethod
    def get_active_programs():
        # TODO figure out what actually defines an "active" program
        return Program.objects.exclude(student_reg_status=RegStatusOptions.POST_PROGRAM)


class Class(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.PositiveIntegerField()
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "classes"

    def __str__(self):
        return self.title


class Section(models.Model):
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)
    number = models.PositiveIntegerField()

    class Meta:
        unique_together = (("clazz", "number"),)
        constraints = [
            # number > 0
            models.CheckConstraint(check=models.Q(number__gt=0), name="number_nonzero")
        ]

    @property
    def program(self):
        return self.clazz.program

    @property
    def num_students(self):
        return StudentClassRegistration.objects.filter(section__id=self.id).count()

    def __str__(self):
        return str(self.clazz) + " sec. " + str(self.number)


class Timeslot(models.Model):
    """
    A Timeslot is a date x duration block during which a program is happening.
    The duration should be the smallest denomination of time that schedule
    offsets need to be able to accommodate.

    TODO(constraint): Timeslot durations should be constant for a given program.
    TODO(constraint): start.time and end.time could only be a fixed set of
    values (potentially on the hour and half hour, maybe quarter hour)
    TODO(constraint): start and end on the same day, except for edge cases like
    midnight (e.g. Firehose) (makes printing nicer as well)

    Examples:
    A Splash where all classes are multiples of an hour may have 19 timeslots
        2019/11/16 10:00–11:00, 11:00–12:00, and so on (for a total of 10)
        2019/11/17 09:00–10:00, 10:00–11:00, and so on (for a total of 9)

    An HSSP with 1-hour and 1.5-hour classes may have 42 timeslots
    (6 timeslots/day x 7 days/program)
        2020/02/29 13:00–13:30, 13:30–14:00, ... , 15:30–16:00 (total of 6)
        and repeated for 2020/03/07, and so on (for 7 Saturdays)
    """

    # TODO: come up with a way to disambiguate between slot times, class times,
    # and effective class times (with transition)
    start = models.DateTimeField()
    end = models.DateTimeField()
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("start", "end", "program"),)
        constraints = [
            # start < end
            models.CheckConstraint(check=models.Q(start__lt=models.F("end")), name="start_lt_end")
        ]

    def __str__(self):
        time_format = "%-I:%M %p"
        date_format = "%-m/%d/%y"
        return (
            str(self.program)
            + " ("
            + self.start.strftime(date_format)
            + ", "
            + self.start.strftime(time_format)
            + " to "
            + self.end.strftime(time_format)
            + ")"
        )


class ScheduledBlock(models.Model):
    """
    A ScheduledBlock represents a section of a class scheduled at a timeslot of
    a program TODO: in a particular classroom.

    A 2-hour section scheduled in a program with 1-hour timeslot durations would
    be represented by two ScheduledBlock objects. A 1.5-hour section scheduled
    in a program with half-hour timeslot durations would be represented by three
    ScheduledBlock objects.
    """

    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    timeslot = models.ForeignKey(Timeslot, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("section", "timeslot"),)

    @property
    def program(self):
        return self.timeslot.program

    def __str__(self):
        return str(self.section) + " during " + str(self.timeslot)

    def clean(self):
        errors = {}
        # assert section.program == timeslot.program
        if self.section.program != self.timeslot.program:
            # both are here for the admin panel to generate errors in the correct location
            errors["section"] = ValidationError(
                "The Section's program must match the Timeslot's program."
            )
            errors["timeslot"] = ValidationError(
                "The Section's program must match the Timeslot's program."
            )
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super(ScheduledBlock, self).save(*args, **kwargs)


# TODO: Validate that the fk users have correct type before creation
class StudentRegistration(models.Model):
    student = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    # student reg status
    reg_status = models.CharField(max_length=20, choices=RegStatusOptions.choices)

    # TODO(mvadari): hmm "updated" might be a better than "check"? (e.g. profile_updated)
    # or maybe "completed"? Looks like these bubble up all the way to the frontend
    update_profile_check = models.BooleanField(default=False)
    emergency_info_check = models.BooleanField(default=False)
    liability_check = models.BooleanField(default=False)
    medliab_check = models.BooleanField(default=False)
    availability_check = models.BooleanField(default=False)
    payment_check = models.BooleanField(default=False)

    def __init__(self, *args, **kwargs):
        super(StudentRegistration, self).__init__(*args, **kwargs)
        if not self.id and hasattr(self, "program") and not self.reg_status:
            self.reg_status = self.program.student_reg_status

    @property
    def classes(self):
        sections = StudentClassRegistration.objects.filter(studentreg=self).values_list(
            "section", flat=True
        )
        ids = Section.objects.filter(pk__in=sections).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)

    class Meta:
        unique_together = (("student", "program"),)

    def __str__(self):
        return str(self.student.username) + "/" + str(self.program)

    def clean(self):
        errors = {}
        # assert student.is_student
        if not self.student.is_student:
            errors["student"] = ValidationError("This user is not a student.")
        # assert program.student_reg_open (since we're creating a new StudentReg object)
        if not self.program.student_reg_open:
            errors["program"] = ValidationError(
                "This program does not have student registration open."
            )
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super(StudentClassRegistration, self).save(*args, **kwargs)


class StudentClassRegistration(models.Model):
    studentreg = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("studentreg", "section"),)
        # TODO CONSTRAINT: clazz.program == studentreg.program

    @property
    def student(self):
        return self.studentreg.student

    @property
    def program(self):
        return self.studentreg.program

    def __str__(self):
        return str(self.student.username) + "/" + str(self.section)

    def clean(self):
        errors = {}
        # assert clazz.program == studentreg.program
        if self.clazz.program != self.studentreg.program:
            # both are here for the admin panel to generate errors in the correct location
            errors["clazz"] = ValidationError(
                "The Class's program must match the StudentRegistration's program."
            )
            errors["studentreg"] = ValidationError(
                "The Class's program must match the StudentRegistration's program."
            )
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super(StudentClassRegistration, self).save(*args, **kwargs)


class TeacherRegistration(models.Model):
    # TODO(mvadari): same naming comment about "check" as above
    teacher = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    update_profile_check = models.BooleanField(default=False)
    # TODO add shirt size

    class Meta:
        unique_together = (("teacher", "program"),)

    @property
    def classes(self):
        ids = TeacherClassRegistration.objects.filter(teacher=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.program)


class TeacherClassRegistration(models.Model):
    teacherreg = models.ForeignKey(TeacherRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("teacherreg", "clazz"),)

    @property
    def teacher(self):
        return self.teacherreg.teacher

    @property
    def program(self):
        return self.teacherreg.program

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.clazz)

    def clean(self):
        errors = {}
        # assert clazz.program == teacherreg.program
        if self.clazz.program != self.teacherreg.program:
            # both are here for the admin panel to generate errors in the correct location
            errors["clazz"] = ValidationError(
                "The Class's program must match the TeacherRegistration's program."
            )
            errors["teacherreg"] = ValidationError(
                "The Class's program must match the TeacherRegistration's program."
            )
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super(TeacherClassRegistration, self).save(*args, **kwargs)
