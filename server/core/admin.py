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
        ("first_name", "last_name"),
        "email",
    )
    list_display = ("username", "email", "first_name", "last_name", "is_student", "is_teacher")
    search_fields = ("username", "email", "first_name", "last_name")
    inlines = [StudentInline, TeacherInline]


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "program", "capacity")
    search_fields = ("title", "id")
    readonly_fields = ("id", "num_students")
    fields = ("id", "title", ("capacity", "num_students"), "program", "description")

    # TODO figure out how to add field to add/remove teachers registered for the program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    fields = (("name", "edition"), "student_reg_open", "student_reg_status", "teacher_reg_open")

    def save_model(self, request, obj, form, change):
        if "student_reg_status" in form.changed_data:
            studentregs = StudentRegistration.objects.filter(program=obj)
            studentregs.update(reg_status=obj.student_reg_status)
        super().save_model(request, obj, form, change)


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "program",
        "reg_status",
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


admin.site.register(TeacherClassRegistration)
admin.site.register(StudentClassRegistration)
