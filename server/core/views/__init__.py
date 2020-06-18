from django.shortcuts import render
from django.views.generic import ListView

from .signup import *  # noqa
from .studentreg import *  # noqa
from .teacherreg import *  # noqa
from .api import *  # noqa
from ..models import Student, Class


class StudentsView(ListView):
    template_name = "core/students.html"
    context_object_name = "students"

    def get_queryset(self):
        return Student.objects.all()


class ClassesView(ListView):
    template_name = "core/classes.html"
    context_object_name = "classes"

    def get_queryset(self):
        return Class.objects.all()


def index(request):
    return render(request, "core/index.html")
