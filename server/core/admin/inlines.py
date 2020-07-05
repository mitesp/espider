from core.models import (
    StudentClassRegistration,
    StudentProfile,
    TeacherClassRegistration,
    TeacherProfile,
)
from django.contrib import admin


class StudentInline(admin.StackedInline):
    model = StudentProfile


class TeacherInline(admin.StackedInline):
    model = TeacherProfile


class StudentClassRegistrationInline(admin.TabularInline):
    model = StudentClassRegistration
    autocomplete_fields = ["studentreg", "clazz"]


class TeacherClassRegistrationInline(admin.TabularInline):
    model = TeacherClassRegistration
    min_num = 2
    extra = 0
    autocomplete_fields = ["teacherreg", "clazz"]
