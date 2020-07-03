from core.models import ESPUser
from django.contrib import admin

from .utils import StudentInline, TeacherInline


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
