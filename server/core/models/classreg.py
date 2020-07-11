from django.db import models

from .clazz import Class, Section
from .registration import StudentRegistration, TeacherRegistration


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
