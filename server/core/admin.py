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


class ActiveProgramFilter(admin.SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = "program"

    # Parameter for the filter that will be used in the URL query.
    parameter_name = "program"

    def lookups(self, request, model_admin):
        """
        Returns a list of tuples. The first element in each
        tuple is the coded value for the option that will
        appear in the URL query. The second element is the
        human-readable name for the option that will appear
        in the right sidebar.
        """
        active_programs = Program.get_active_programs()
        return [(program.id, str(program)) for program in active_programs]

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        if self.value():
            return queryset.filter(program=self.value())
        else:
            return queryset


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
    list_filter = (ActiveProgramFilter,)

    # TODO figure out how to add field to add/remove teachers registered for the program


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("__str__", "student_reg_open", "student_reg_status", "teacher_reg_open")
    fields = (("name", "edition"), "student_reg_open", "student_reg_status", "teacher_reg_open")

    def save_model(self, request, obj, form, change):
        if "student_reg_status" in form.changed_data:
            studentregs = StudentRegistration.objects.filter(program=obj)
            studentregs.update(reg_status=obj.student_reg_status)
        super().save_model(request, obj, form, change)


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    readonly_fields = ("student", "program")
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
    fields = (
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
