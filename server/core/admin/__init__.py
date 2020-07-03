from core.models import (
    Class,
    Program,
    StudentClassRegistration,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherRegistration,
)
from django.contrib import admin

from .users import *  # noqa
from .utils import (
    ActiveProgramClassRegFilter,
    ActiveProgramFilter,
    ProgramActiveFilter,
    StudentClassRegistrationInline,
    TeacherClassRegistrationInline,
)


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "program", "capacity")
    search_fields = ("title", "id")
    readonly_fields = ("id", "num_students")
    fields = ("id", "title", ("capacity", "num_students"), "program", "description")
    list_filter = (ActiveProgramFilter,)
    inlines = [TeacherClassRegistrationInline, StudentClassRegistrationInline]
    save_on_top = True

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        if "autocomplete" in request.path:
            reg_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            if "studentregistration" in request.META.get("HTTP_REFERER"):
                program = StudentRegistration.objects.get(pk=reg_id).program
                queryset = queryset.filter(program__exact=program).order_by("title")
            if "teacherregistration" in request.META.get("HTTP_REFERER"):
                program = TeacherRegistration.objects.get(pk=reg_id).program
                queryset = queryset.filter(program__exact=program).order_by("title")
                # TODO change to by timeslot after scheduling (or something)

        return super().get_search_results(request, queryset, search_term)


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("__str__", "student_reg_open", "student_reg_status", "teacher_reg_open")
    list_filter = (ProgramActiveFilter, "student_reg_open", "teacher_reg_open")

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
    search_fields = ("student__username", "student__id", "program__name")
    save_on_top = True

    def add_view(self, request, extra_content=None):
        self.fields = ("student", "program", "reg_status")
        self.readonly_fields = ()
        self.inlines = []
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
        self.readonly_fields = ("student", "program", "studentclassregistration_set")
        self.inlines = [StudentClassRegistrationInline]
        return super(StudentRegistrationAdmin, self).change_view(request, object_id, extra_content)

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        if "autocomplete" in request.path and "class" in request.META.get("HTTP_REFERER"):
            class_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            program = Class.objects.get(pk=class_id).program
            queryset = queryset.filter(program__exact=program).order_by("student__username")
        return super().get_search_results(request, queryset, search_term)


@admin.register(TeacherRegistration)
class TeacherRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("teacher", "program")
    list_display = ("teacher", "program", "update_profile_check")
    search_fields = ("teacher__username", "teacher__id", "program__name")
    fields = (
        "teacher",
        "program",
        "update_profile_check",
    )
    list_filter = (ActiveProgramFilter,)
    inlines = [TeacherClassRegistrationInline]
    save_on_top = True

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        if "autocomplete" in request.path and "class" in request.META.get("HTTP_REFERER"):
            class_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            program = Class.objects.get(pk=class_id).program
            queryset = queryset.filter(program__exact=program).order_by("teacher__username")
        return super().get_search_results(request, queryset, search_term)


@admin.register(StudentClassRegistration)
class StudentClassRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("studentreg", "student", "program", "clazz")
    list_display = ("student", "program", "clazz")
    search_fields = ("studentreg", "clazz")
    fields = ("student", "program", "clazz")
    list_filter = (ActiveProgramClassRegFilter,)


@admin.register(TeacherClassRegistration)
class TeacherClassRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("teacherreg", "teacher", "program", "clazz")
    list_display = ("teacher", "program", "clazz")
    search_fields = ("teacherreg", "clazz")
    fields = ("teacher", "program", "clazz")
    list_filter = (ActiveProgramClassRegFilter,)
