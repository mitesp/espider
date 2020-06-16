import datetime

from django.db import models
from django.utils import timezone
from django.forms import ModelForm
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


#TODO remove the blank options from these (keeping them so createsuperuser still works)
class ESPUser(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True) #TODO there's a phone number field we can add with pip
    pronouns = models.CharField(max_length=40, blank=True)
    city = models.CharField(max_length=200, blank=True)
    state = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=200, blank=True)

class Student(models.Model):
    user = models.OneToOneField(ESPUser, on_delete=models.CASCADE, primary_key=True)
    dob = models.DateField(max_length=8, default="1969-12-31")
    grad_year = models.IntegerField(default=1970)
    school = models.CharField(max_length=200, default="")


class Teacher(models.Model):
    user = models.OneToOneField(ESPUser, on_delete=models.CASCADE, primary_key=True)
    affiliation = models.CharField(max_length=20) #TODO options?

