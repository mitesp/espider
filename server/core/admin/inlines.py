from core.models import (
    ScheduledBlock,
    Section,
    StudentClassRegistration,
    StudentProfile,
    TeacherClassRegistration,
    TeacherProfile,
    Timeslot,
)
from django.contrib import admin


class StudentInline(admin.StackedInline):
    model = StudentProfile


class TeacherInline(admin.StackedInline):
    model = TeacherProfile


class SectionInline(admin.StackedInline):
    model = Section
    min_num = 1
    extra = 1


class TimeslotInline(admin.TabularInline):
    model = Timeslot
    min_num = 1
    extra = 2


class ScheduledBlockInline(admin.TabularInline):
    model = ScheduledBlock
    autocomplete_fields = ["timeslot"]


class StudentClassRegistrationInline(admin.TabularInline):
    model = StudentClassRegistration
    autocomplete_fields = ["studentreg", "section"]


class TeacherClassRegistrationInline(admin.TabularInline):
    model = TeacherClassRegistration
    min_num = 1
    extra = 0
    autocomplete_fields = ["teacherreg", "clazz"]
