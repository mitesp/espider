from django.contrib import admin

from .models import (
    Class,
    ESPUser,
    Program,
    Student,
    StudentClassRegistration,
    Teacher,
    TeacherClassRegistration,
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


admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(Program)

admin.site.register(TeacherClassRegistration)
admin.site.register(StudentClassRegistration)
