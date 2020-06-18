from django.db import models

from .users import *


class Program(models.Model):
    name = models.CharField(
        max_length=200
    )  # TODO maybe this should be a constant set to choose from?
    edition = models.CharField(max_length=200)  # this is season + year
    # TODO add timeslots?

    def __str__(self):
        return self.name + " " + self.edition


class Class(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.IntegerField()
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    @property
    def num_students(self):
        return StudentClassRegistration.objects.filter(clazz__id=self.id).count()

    def __str__(self):
        return self.title


class TeacherClassRegistration(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    # ensures a teacher can't register the same class twice
    class Meta:
        unique_together = (("teacher", "clazz"),)

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.clazz)


class StudentClassRegistration(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    clazz = models.ForeignKey(Class, on_delete=models.CASCADE)

    # ensures a student can't register for the same class twice
    class Meta:
        unique_together = (("student", "clazz"),)

    def __str__(self):
        return str(self.student.username) + "/" + str(self.clazz)
