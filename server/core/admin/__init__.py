from core.models import (
    Class,
    Program,
    ScheduledBlock,
    Section,
    StudentClassRegistration,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherRegistration,
    Timeslot,
)
from django.contrib import admin

from .filters import ActiveProgramClassRegFilter, ActiveProgramFilter
from .inlines import (
    ScheduledBlockInline,
    SectionInline,
    StudentClassRegistrationInline,
    TeacherClassRegistrationInline,
    TimeslotInline,
)
from .users import *  # noqa


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("__str__", "student_reg_open", "student_reg_status", "teacher_reg_open")
    inlines = [TimeslotInline]

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


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "program", "capacity")
    search_fields = ("title", "id")
    readonly_fields = ("id",)
    fields = ("id", "title", "capacity", "program", "description")
    list_filter = (ActiveProgramFilter,)
    inlines = [TeacherClassRegistrationInline, SectionInline]
    save_on_top = True

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        # TODO figure out add
        if "autocomplete" in request.path and "change" in request.META.get("HTTP_REFERER"):
            reg_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            if "teacherregistration" in request.META.get("HTTP_REFERER"):
                program = TeacherRegistration.objects.get(pk=reg_id).program
                queryset = queryset.filter(program__exact=program).order_by("title")
                # TODO change to by timeslot after scheduling (or something)

        return super().get_search_results(request, queryset, search_term)


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("__str__", "program")
    search_fields = ("clazz__title", "clazz__id", "number")
    inlines = [ScheduledBlockInline, StudentClassRegistrationInline]
    save_on_top = True

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        # TODO figure out add
        if "autocomplete" in request.path and "change" in request.META.get("HTTP_REFERER"):
            reg_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            if "studentregistration" in request.META.get("HTTP_REFERER"):
                program = StudentRegistration.objects.get(pk=reg_id).program
                queryset = queryset.filter(program__exact=program).order_by("title")
                # TODO change to by timeslot after scheduling (or something)

        return super().get_search_results(request, queryset, search_term)


@admin.register(Timeslot)
class TimeslotAdmin(admin.ModelAdmin):
    list_display = ("start", "end", "program")
    readonly_fields = ("program",)
    search_fields = ("start", "end", "program")
    inlines = [ScheduledBlockInline]

    def get_search_results(self, request, queryset, search_term):
        # this is a little bit hacky but checks if it's an autocomplete request from an Inline
        # TODO figure out add
        if "autocomplete" in request.path and "change" in request.META.get("HTTP_REFERER"):
            section = int(request.META.get("HTTP_REFERER").split("/")[6])
            if "section" in request.META.get("HTTP_REFERER"):
                program = Section.objects.get(pk=section).clazz.program
                queryset = queryset.filter(program__exact=program).order_by("start")

        return super().get_search_results(request, queryset, search_term)


@admin.register(ScheduledBlock)
class ScheduledBlockAdmin(admin.ModelAdmin):
    list_display = ("section", "timeslot", "program")


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
        if (
            "autocomplete" in request.path
            and "class" in request.META.get("HTTP_REFERER")
            and "change" in request.META.get("HTTP_REFERER")
        ):
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
        if (
            "autocomplete" in request.path
            and "class" in request.META.get("HTTP_REFERER")
            and "change" in request.META.get("HTTP_REFERER")
        ):
            class_id = int(request.META.get("HTTP_REFERER").split("/")[6])
            program = Class.objects.get(pk=class_id).program
            queryset = queryset.filter(program__exact=program).order_by("teacher__username")
        return super().get_search_results(request, queryset, search_term)


@admin.register(StudentClassRegistration)
class StudentClassRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("studentreg", "student", "program", "section")
    list_display = ("student", "program", "section")
    search_fields = ("studentreg", "section")
    fields = ("student", "program", "section")
    list_filter = (ActiveProgramClassRegFilter,)


@admin.register(TeacherClassRegistration)
class TeacherClassRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("teacherreg", "teacher", "program", "clazz")
    list_display = ("teacher", "program", "clazz")
    search_fields = ("teacherreg", "clazz")
    fields = ("teacher", "program", "clazz")
    list_filter = (ActiveProgramClassRegFilter,)
