from django.db import models

from .users import *  # noqa
from .users import ESPUser


class Program(models.Model):
    name = models.CharField(max_length=200)  # TODO maybe this should be a constant set
    edition = models.CharField(max_length=200)  # this is (season +) year
    student_reg_open = models.BooleanField(default=False)
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


class Class(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.PositiveIntegerField()
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    @property
    def num_students(self):
        return StudentClassRegistration.objects.filter(clazz__id=self.id).count()

    def __str__(self):
        return self.title


class RegStatusOptions(models.TextChoices):
    CLASS_PREFERENCES = ("CLASS_PREFERENCES",)
    FROZEN_PREFERENCES = ("FROZEN_PREFERENCES",)
    CHANGE_CLASSES = ("CHANGE_CLASSES",)
    PRE_PROGRAM = ("PRE_PROGRAM",)
    DAY_OF = ("DAY_OF",)
    POST_PROGRAM = ("POST_PROGRAM",)


# TODO: Validate that the fk users have correct type before creation
class StudentRegistration(models.Model):
    student = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    # student reg status
    reg_status = models.CharField(
        max_length=20, choices=RegStatusOptions.choices, default=RegStatusOptions.CLASS_PREFERENCES
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

    def get_classes(self):
        ids = StudentClassRegistration.objects.filter(student=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)


class StudentClassRegistration(models.Model):
    studentreg = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("studentreg", "clazz"),)

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

    def get_classes(self):
        ids = TeacherClassRegistration.objects.filter(teacher=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)


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
