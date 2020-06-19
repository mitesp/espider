from django.contrib import admin

from .models import (
    Class,
    ESPUser,
    Program,
    Student,
    StudentClassRegistration,
    StudentRegistration,
    Teacher,
    TeacherClassRegistration,
    TeacherRegistration,
)


class StudentInline(admin.TabularInline):
    model = Student


class TeacherInline(admin.TabularInline):
    model = Teacher


@admin.register(ESPUser)
class ESPUserAdmin(admin.ModelAdmin):
    fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "pronouns",
        "city",
        "state",
        "country",
        "is_student",
        "is_teacher",
    )
    list_display = ("username", "email", "first_name", "last_name", "is_student", "is_teacher")
    list_filter = ("is_student", "is_teacher")
    search_fields = ("username", "email")
    inlines = [StudentInline, TeacherInline]


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "program",
        "update_profile_check",
        "emergency_info_check",
        "medliab_check",
        "liability_check",
    )
    search_fields = ("student", "program")


@admin.register(TeacherRegistration)
class TeacherRegistrationAdmin(admin.ModelAdmin):
    list_display = ("teacher", "program", "update_profile_check")
    search_fields = ("teacher", "program")


admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Program)

admin.site.register(TeacherClassRegistration)
admin.site.register(StudentClassRegistration)
