from core.models import ESPUser, Student, Teacher
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction


class ESPSignUpForm(UserCreationForm):
    class Meta:
        model = ESPUser
        fields = (
            "username",
            "email",
            "password1",
            "password2",
            "first_name",
            "last_name",
            "phone_number",
            "pronouns",
            "city",
            "state",
            "country",
        )

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=commit)
        return user


class StudentSignUpForm(ESPSignUpForm):
    dob = forms.DateField(label="Date of Birth", required=False)
    grad_year = forms.IntegerField(label="Graduation Year", required=False)
    school = forms.CharField(max_length=200, required=False)

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_student = True
        user.save()
        Student.objects.create(
            user=user,
            dob=self.cleaned_data.get("dob"),
            grad_year=self.cleaned_data.get("grad_year"),
            school=self.cleaned_data.get("school"),
        )
        return user


class TeacherSignUpForm(ESPSignUpForm):
    affiliation = forms.CharField(max_length=20, required=False)

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_teacher = True
        user.save()
        Teacher.objects.create(user=user, affiliation=self.cleaned_data.get("affiliation"))
        return user
