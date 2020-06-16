from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction

from .models import Student, ESPUser

class ESPSignUpForm(UserCreationForm):
    phone_number = forms.CharField(max_length=20, label="Phone Number", required=False) #TODO there's a phone number field we can add with pip
    pronouns = forms.CharField(max_length=40, required=False)
    city = forms.CharField(max_length=200, required=False)
    state = forms.CharField(max_length=200, label="State (Leave blank if outside the US)", required=False)
    country = forms.CharField(max_length=200, required=False)

    class Meta(UserCreationForm.Meta):
        model = ESPUser
        fields = ("username", "email", "password1", "password2", "first_name", "last_name",)

class StudentSignUpForm(ESPSignUpForm):
    dob = forms.DateField(label="Date of Birth", required=False)
    grad_year = forms.IntegerField(label="Graduation Year", required=False)
    school = forms.CharField(max_length=200, required=False)    

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_student = True
        user.save()
        student = Student.objects.create(user=user)
        return user


class TeacherSignUpForm(ESPSignUpForm):
    affiliation = forms.CharField(max_length=20)

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_teacher = True
        if commit:
            user.save()
        return user

class OtherAccountSignUpForm(ESPSignUpForm):
    pass
