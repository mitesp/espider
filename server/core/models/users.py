from django.contrib.auth.models import AbstractUser
from django.db import models


class ESPUser(AbstractUser):
    # inherits username, first_name, last_name, email, is_staff, is_superuser, etc.

    # TODO add constraint so user cannot have both a student_profile and a teacher_profile

    @property
    def is_student(self):
        return hasattr(self, "student_profile")

    @property
    def is_teacher(self):
        return hasattr(self, "teacher_profile")

    @property
    def profile(self):
        if self.is_student:
            return self.student_profile
        elif self.is_teacher:
            return self.teacher_profile

    def __str__(self):
        return "{} ({})".format(self.username, self.id)


# TODO: for all profiles choose real lengths and figure out what shouldn't be blank/null,
#       as well as actual default values
class Profile(models.Model):
    phone_number = models.CharField(max_length=20, blank=True)  # TODO: use django-phonenumber-field
    pronouns = models.CharField(max_length=40, blank=True)  # TODO: use models.TextChoices
    city = models.CharField(max_length=20, blank=True)
    state = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=20, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.user)


class StudentProfile(Profile):
    user = models.OneToOneField(
        ESPUser, on_delete=models.CASCADE, primary_key=True, related_name="student_profile"
    )
    date_of_birth = models.DateField(max_length=8, blank=True, auto_now_add=True)
    grad_year = models.IntegerField(blank=True, default=0)
    school = models.CharField(max_length=200, blank=True)


class TeacherProfile(Profile):
    user = models.OneToOneField(
        ESPUser, on_delete=models.CASCADE, primary_key=True, related_name="teacher_profile"
    )
    affiliation = models.CharField(max_length=20, blank=True)  # TODO options?
