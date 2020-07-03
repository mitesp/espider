from core.models import (
    Class,
    Program,
    StudentClassRegistration,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherRegistration,
)
from django.contrib import admin

from .utils import ActiveProgramFilter


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "program", "capacity")
    search_fields = ("title", "id")
    readonly_fields = ("id", "num_students")
    fields = ("id", "title", ("capacity", "num_students"), "program", "description")
    list_filter = (ActiveProgramFilter,)

    # TODO figure out how to add field to add/remove teachers registered for the program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("__str__", "student_reg_open", "student_reg_status", "teacher_reg_open")

    def save_model(self, request, obj, form, change):
        if "student_reg_status" in form.changed_data:
            studentregs = StudentRegistration.objects.filter(program=obj)
            studentregs.update(reg_status=obj.student_reg_status)
        super().save_model(request, obj, form, change)

    def add_view(self, request, extra_content=None):
        self.fields = (("name", "edition"),)
        return super(ProgramAdmin, self).add_view(request, extra_content)

    def change_view(self, request, object_id, extra_content=None):
        self.fields = (
            ("name", "edition"),
            "student_reg_open",
            "student_reg_status",
            "teacher_reg_open",
        )
        return super(ProgramAdmin, self).change_view(request, object_id, extra_content)


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
    list_filter = (
        ActiveProgramFilter,
        "reg_status",
        "medliab_check",
        "liability_check",
        "availability_check",
        "payment_check",
    )
    search_fields = ("student", "program")

    def add_view(self, request, extra_content=None):
        self.fields = ("student", "program", "reg_status")
        self.readonly_fields = ()
        return super(StudentRegistrationAdmin, self).add_view(request, extra_content)

    def change_view(self, request, object_id, extra_content=None):
        self.fields = (
            "student",
            "program",
            "reg_status",
            (
                "update_profile_check",
                "emergency_info_check",
                "medliab_check",
                "liability_check",
                "availability_check",
                "payment_check",
            ),
        )
        self.readonly_fields = ("student", "program")
        return super(StudentRegistrationAdmin, self).change_view(request, object_id, extra_content)


@admin.register(TeacherRegistration)
class TeacherRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("teacher", "program")
    list_display = ("teacher", "program", "update_profile_check")
    search_fields = ("teacher", "program")
    fields = (
        "teacher",
        "program",
        "update_profile_check",
    )
    list_filter = (ActiveProgramFilter,)


admin.site.register(TeacherClassRegistration)
admin.site.register(StudentClassRegistration)
