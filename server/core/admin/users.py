from core.models import ESPUser
from django.contrib import admin

from .utils import StudentInline, TeacherInline, UserTypeFilter


@admin.register(ESPUser)
class ESPUserAdmin(admin.ModelAdmin):
    fields = (
        "username",
        ("first_name", "last_name"),
        "email",
        "is_staff",
        "is_superuser",
    )
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "student",
        "teacher",
        "is_staff",
    )
    search_fields = ("username", "email", "first_name", "last_name")
    inlines = [StudentInline, TeacherInline]
    list_filter = (UserTypeFilter,)
    save_on_top = True

    def student(self, obj):
        return obj.is_student

    def teacher(self, obj):
        return obj.is_teacher

    student.boolean = True
    teacher.boolean = True
