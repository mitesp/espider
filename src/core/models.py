import datetime

from django.db import models
from django.utils import timezone
from django.forms import ModelForm
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


#TODO remove the blank options from these (keeping them so createsuperuser still works/easier to create dummy accounts)
class ESPUser(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True) #TODO there's a phone number field we can add with pip
    pronouns = models.CharField(max_length=40, blank=True) #TODO replace this with set options or something
    city = models.CharField(max_length=200, blank=True)
    state = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=200, blank=True)

class Student(models.Model):
    user = models.OneToOneField(ESPUser, on_delete=models.CASCADE, primary_key=True, related_name='student')
    dob = models.DateField(max_length=8, default="1969-12-31")
    grad_year = models.IntegerField(default=1970)
    school = models.CharField(max_length=200, default="")
    #TODO add emergency info maybe?

    @property
    def id(self):
        return self.user.id

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name
    
    @property
    def email(self):
        return self.user.email

class Teacher(models.Model):
    user = models.OneToOneField(ESPUser, on_delete=models.CASCADE, primary_key=True, related_name='teacher')
    affiliation = models.CharField(max_length=20, blank=True) #TODO options?

    @property
    def id(self):
        return self.user.id

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name
    
    @property
    def email(self):
        return self.user.email

class Class(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.IntegerField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    @property
    def num_students(self):
        return len(StudentClassRegistration.objects.filter(clss__id=self.id))

    def __str__(self):
        return self.title
    

class TeacherClassRegistration(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    clss = models.ForeignKey(Class, on_delete=models.CASCADE)

    #ensures a teacher can't register the same class twice
    class Meta:
        unique_together = (("teacher", "clss"),)


class StudentClassRegistration(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    clss = models.ForeignKey(Class, on_delete=models.CASCADE)

    #ensures a student can't register for the same class twice
    class Meta:
        unique_together = (("student", "clss"),)