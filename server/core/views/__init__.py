from django.shortcuts import render
from django.views.generic import ListView

from ..models import Class, Student
from .api import *  # noqa
from .signup import *  # noqa
from .studentreg import *  # noqa
from .teacherreg import *  # noqa


class StudentsView(ListView):
    template_name = "core/students.html"
    context_object_name = "students"
    model = Student


class ClassesView(ListView):
    template_name = "core/classes.html"
    context_object_name = "classes"
    model = Class


def index(request):
    return render(request, "core/index.html")
