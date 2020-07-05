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
    # TODO add timeslots?

    def __str__(self):
        return self.name + " " + self.edition

    @property
    def url(self):
        return self.name + "/" + self.edition  # TODO handle multi-word editions/seasons

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

    @property
    def num_students(self):
        return StudentClassRegistration.objects.filter(clazz__id=self.id).count()

    def __str__(self):
        return self.title


class Section(models.Model):
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)
    number = models.PositiveIntegerField()
    # TODO(constraint): PositiveIntegerField can be 0 due to django backwards
    # compatibility, but we should constrain it

    class Meta:
        unique_together = (("clazz", "number"),)

    def __str__(self):
        return str(self.clazz) + " sec. " + str(self.number)


class Timeslot(models.Model):
    """
    A Timeslot is a date x duration block during which a program is happening.
    The duration should be the smallest denomination of time that schedule
    offsets need to be able to accommodate.

    TODO(constraint): Timeslot durations should be constant for a given program.
    TODO(constraint): start < end
    TODO(constraint): start.time and end.time could only be a fixed set of
    values (potentially on the hour and half hour, maybe quarter hour)

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

    def __str__(self):
        return str(self.program) + "(" + str(self.start) + ", " + str(self.end) + ")"


class ScheduledBlock(models.Model):
    """
    A ScheduledBlock represents a section of a class scheduled at a timeslot of
    a program TODO: in a particular classroom.

    A 2-hour section scheduled in a program with 1-hour timeslot durations would
    be represented by two ScheduledBlock objects. A 1.5-hour section scheduled
    in a program with half-hour timeslot durations would be represented by three
    ScheduledBlock objects.

    TODO(constraint): section.program == timeslot.program
    TODO(constraint): timeslot x section is unique
    """

    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    timeslot = models.ForeignKey(Timeslot, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.section) + " during " + str(self.timeslot)


# TODO: Validate that the fk users have correct type before creation
class StudentRegistration(models.Model):
    student = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    # student reg status
    reg_status = models.CharField(
        max_length=20,
        choices=RegStatusOptions.choices,
        default=RegStatusOptions.CLASS_PREFERENCES
        # TODO figure out if it's possible to make the default whatever the program value is
        # might be easier to do this by hand in whatever function is creating this studentreg
    )

    # TODO(mvadari): hmm "updated" might be a better than "check"? (e.g. profile_updated)
    # or maybe "completed"? Looks like these bubble up all the way to the frontend
    update_profile_check = models.BooleanField(default=False)
    emergency_info_check = models.BooleanField(default=False)
    liability_check = models.BooleanField(default=False)
    medliab_check = models.BooleanField(default=False)
    availability_check = models.BooleanField(default=False)
    payment_check = models.BooleanField(default=False)

    class Meta:
        unique_together = (("student", "program"),)

    def __str__(self):
        return str(self.student.username) + "/" + str(self.program)

    @property
    def classes(self):
        ids = StudentClassRegistration.objects.filter(studentreg=self).values_list(
            "clazz", flat=True
        )
        return Class.objects.filter(id__in=ids)


class StudentClassRegistration(models.Model):
    studentreg = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("studentreg", "clazz"),)
        # TODO CONSTRAINT: clazz.program == studentreg.program

    @property
    def student(self):
        return self.studentreg.student

    @property
    def program(self):
        return self.studentreg.program

    def __str__(self):
        return str(self.student.username) + "/" + str(self.clazz)


class TeacherRegistration(models.Model):
    # TODO(mvadari): same naming comment about "check" as above
    teacher = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    update_profile_check = models.BooleanField(default=False)
    # TODO add shirt size

    class Meta:
        unique_together = (("teacher", "program"),)

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.program)

    @property
    def classes(self):
        ids = TeacherClassRegistration.objects.filter(teacher=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)


class TeacherClassRegistration(models.Model):
    teacherreg = models.ForeignKey(TeacherRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("teacherreg", "clazz"),)
        # TODO CONSTRAINT: clazz.program == teacherreg.program

    @property
    def teacher(self):
        return self.teacherreg.teacher

    @property
    def program(self):
        return self.teacherreg.program

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.clazz)
