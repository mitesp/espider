from core.models import Program, StudentProfile, TeacherProfile
from django.contrib import admin


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
        e.g. (?program={id})
        """
        active_programs = Program.get_active_programs()
        return [(program.id, str(program)) for program in active_programs]

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        `self.value()` is the string used in the url query
        (the first element of the tuple in `lookups`). If
        it is defined (is not None), then there is a filter
        and this filter should filter the queryset.
        """
        if self.value():
            return queryset.filter(program=self.value())
        else:
            return queryset


class ActiveProgramClassRegFilter(admin.SimpleListFilter):
    title = "program"

    parameter_name = "program"

    def lookups(self, request, model_admin):
        active_programs = Program.get_active_programs()
        return [(program.id, str(program)) for program in active_programs]

    def queryset(self, request, queryset):
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
            ("admin", "Admin"),
        )

    def queryset(self, request, queryset):
        # TODO replace filters with manager methods
        value = self.value()
        if value == "student":
            students = StudentProfile.objects.all().values_list("user", flat=True)
            return queryset.filter(id__in=students)
        elif value == "teacher":
            teachers = TeacherProfile.objects.all().values_list("user", flat=True)
            return queryset.filter(id__in=teachers)
        elif value == "admin":
            return queryset.filter(is_superuser=True)
