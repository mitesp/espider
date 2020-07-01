from django.contrib import admin

from .models import (
    Class,
    ESPUser,
    Program,
    StudentClassRegistration,
    StudentProfile,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherProfile,
    TeacherRegistration,
)


class StudentInline(admin.StackedInline):
    model = StudentProfile


class TeacherInline(admin.StackedInline):
    model = TeacherProfile


@admin.register(ESPUser)
class ESPUserAdmin(admin.ModelAdmin):
    fields = (
        "username",
        "email",
        "first_name",
        "last_name",
    )
    list_display = ("username", "email", "first_name", "last_name", "is_student", "is_teacher")
    search_fields = ("username", "email")
    inlines = [StudentInline, TeacherInline]


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "program",
        "update_profile_check",
        "emergency_info_check",
        "medliab_check",
        "liability_check",
        "availability_check",
        "payment_check",
    )
    search_fields = ("student", "program")


@admin.register(TeacherRegistration)
class TeacherRegistrationAdmin(admin.ModelAdmin):
    list_display = ("teacher", "program", "update_profile_check")
    search_fields = ("teacher", "program")


admin.site.register(Class)
admin.site.register(StudentProfile)
admin.site.register(TeacherProfile)
admin.site.register(Program)

admin.site.register(TeacherClassRegistration)
admin.site.register(StudentClassRegistration)
