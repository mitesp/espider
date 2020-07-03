from core.models import (
    Program,
    StudentClassRegistration,
    StudentProfile,
    TeacherClassRegistration,
    TeacherProfile,
)
from django.contrib import admin

# Filters


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


class ActiveProgramClassRegFilter(admin.SimpleListFilter):
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
            return queryset.filter(clazz__program=self.value())
        else:
            return queryset


class UserTypeFilter(admin.SimpleListFilter):
    title = "user type"
    parameter_name = "user_type"

    def lookups(self, request, model_admin):
        return (
            ("student", "Student"),
            ("teacher", "Teacher"),
        )

    def queryset(self, request, queryset):
        value = self.value()
        if value == "student":
            students = StudentProfile.objects.all().values_list("user", flat=True)
            return queryset.filter(id__in=students)
        elif value == "teacher":
            teachers = TeacherProfile.objects.all().values_list("user", flat=True)
            return queryset.filter(id__in=teachers)


# Inlines


class StudentInline(admin.StackedInline):
    model = StudentProfile


class TeacherInline(admin.StackedInline):
    model = TeacherProfile


class StudentClassRegistrationInline(admin.TabularInline):
    model = StudentClassRegistration
    verbose_name = "Student"
    verbose_name_plural = "Students"
    autocomplete_fields = ["studentreg", "clazz"]


class TeacherClassRegistrationInline(admin.TabularInline):
    model = TeacherClassRegistration
    min_num = 2
    extra = 0
    verbose_name = "Teacher"
    verbose_name_plural = "Teachers"
    autocomplete_fields = ["teacherreg", "clazz"]
