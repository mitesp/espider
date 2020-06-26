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


# TODO: Validate that the fk users have correct type before creation
class StudentRegistration(models.Model):
    class RegStatusOptions(models.TextChoices):
        CLASS_PREFERENCES = ("PREF",)
        FROZEN_PREFERENCES = ("FROZ",)
        CHANGE_CLASSES = ("CH",)
        PRE_PROGRAM = ("PRE",)
        DAY_OF = ("DAY",)
        POST_PROGRAM = "POST"

    student = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    # student reg status
    reg_status = models.CharField(
        max_length=4, choices=RegStatusOptions.choices, default=RegStatusOptions.CLASS_PREFERENCES
    )

    update_profile_check = models.BooleanField(default=False)
    emergency_info_check = models.BooleanField(default=False)
    liability_check = models.BooleanField(default=False)
    medliab_check = models.BooleanField(default=False)
    availability_check = models.BooleanField(default=False)

    class Meta:
        unique_together = (("student", "program"),)

    def __str__(self):
        return str(self.student.username) + "/" + str(self.program)

    def classes(self):
        ids = StudentClassRegistration.objects.filter(student=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)


class StudentClassRegistration(models.Model):
    student = models.ForeignKey(StudentRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    # ensures a student can't register for the same class twice
    class Meta:
        unique_together = (("student", "clazz"),)

    def __str__(self):
        return str(self.student.student.username) + "/" + str(self.clazz)


class TeacherRegistration(models.Model):
    teacher = models.ForeignKey(ESPUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    update_profile_check = models.BooleanField(default=False)
    # TODO add shirt size

    class Meta:
        unique_together = (("teacher", "program"),)

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.program)

    def classes(self):
        ids = TeacherClassRegistration.objects.filter(teacher=self).values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)


class TeacherClassRegistration(models.Model):
    teacher = models.ForeignKey(TeacherRegistration, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    # ensures a teacher can't register the same class twice
    class Meta:
        unique_together = (("teacher", "clazz"),)

    def __str__(self):
        return str(self.teacher.teacher.username) + "/" + str(self.clazz)
