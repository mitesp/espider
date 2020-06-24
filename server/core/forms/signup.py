from core.models import ESPUser, StudentProfile, TeacherProfile
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
        )

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=commit)
        return user


# TODO: This is all extremely hacky/redundant. Improve when moving to react.
class ProfileSignUpForm(ESPSignUpForm):
    phone_number = forms.CharField(max_length=20, required=False)
    pronouns = forms.CharField(max_length=40, required=False)
    city = forms.CharField(max_length=20, required=False)
    state = forms.CharField(max_length=20, required=False)
    country = forms.CharField(max_length=20, required=False)


class StudentSignUpForm(ProfileSignUpForm):
    dob = forms.DateField(label="Date of Birth", required=False)
    grad_year = forms.IntegerField(label="Graduation Year", required=False)
    school = forms.CharField(max_length=200, required=False)

    @transaction.atomic
    def save(self):
        user = super().save()
        StudentProfile.objects.create(
            user=user,
            phone_number=self.cleaned_data.get("phone_number"),
            pronouns=self.cleaned_data.get("pronouns"),
            city=self.cleaned_data.get("city"),
            state=self.cleaned_data.get("state"),
            country=self.cleaned_data.get("country"),
            date_of_birth=self.cleaned_data.get("dob"),
            grad_year=self.cleaned_data.get("grad_year"),
            school=self.cleaned_data.get("school"),
        )
        return user


class TeacherSignUpForm(ProfileSignUpForm):
    affiliation = forms.CharField(max_length=20, required=False)

    @transaction.atomic
    def save(self):
        user = super().save()
        TeacherProfile.objects.create(
            user=user,
            phone_number=self.cleaned_data.get("phone_number"),
            pronouns=self.cleaned_data.get("pronouns"),
            city=self.cleaned_data.get("city"),
            state=self.cleaned_data.get("state"),
            country=self.cleaned_data.get("country"),
            affiliation=self.cleaned_data.get("affiliation"),
        )
        return user
