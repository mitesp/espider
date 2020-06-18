from django.contrib.auth.models import AbstractUser
from django.db import models


# TODO remove the blank options from these (keeping them so createsuperuser still works/easier to
# create dummy accounts)
class ESPUser(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True)  # TODO: use django-phonenumber-field
    pronouns = models.CharField(max_length=40, blank=True)  # TODO: use models.TextChoices
    city = models.CharField(max_length=200, blank=True)
    state = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return "{} {} ({})".format(self.first_name, self.last_name, self.username)


class Student(models.Model):
    user = models.OneToOneField(
        ESPUser, on_delete=models.CASCADE, primary_key=True, related_name="student"
    )
    dob = models.DateField(max_length=8, default="1969-12-31", blank=True)
    grad_year = models.IntegerField(default=1970, blank=True)
    school = models.CharField(max_length=200, default="", blank=True)
    # TODO add emergency info maybe?

    # TODO: this is kinda ugly, we should find a better way to organize this information
    @property
    def id(self):
        return self.user.id

    @property
    def username(self):
        return self.user.username

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

    @property
    def email(self):
        return self.user.email

    def __str__(self):
        return str(self.user)


class Teacher(models.Model):
    user = models.OneToOneField(
        ESPUser, on_delete=models.CASCADE, primary_key=True, related_name="teacher"
    )
    affiliation = models.CharField(max_length=20, blank=True)  # TODO options?

    @property
    def id(self):
        return self.user.id

    @property
    def username(self):
        return self.user.username

    @property
    def first_name(self):
        return self.user.first_name

    @property
    def last_name(self):
        return self.user.last_name

    @property
    def email(self):
        return self.user.email

    def __str__(self):
        return str(self.user)
