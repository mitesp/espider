import datetime

from django.db import models
from django.utils import timezone
from django.forms import ModelForm
import uuid

class Student(models.Model):
    first_name = models.CharField(max_length=200) #TODO figure out unicode support for accents and stuff
    last_name = models.CharField(max_length=200)
    email = models.CharField(max_length=200)

    def __str__(self):
        return str(self.id)

class StudentProfileForm(ModelForm):
    class Meta:
        model = Student
        fields = ["first_name", "last_name", "email"]
