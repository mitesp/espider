import datetime

from django.db import models
from django.utils import timezone
from django.forms import ModelForm
import uuid

# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.question_text

    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

    was_published_recently.admin_order_field = 'pub_date'
    was_published_recently.boolean = True
    was_published_recently.short_description = 'Published recently?'

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text

#ESP Classes

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