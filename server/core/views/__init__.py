from django.shortcuts import render
from django.views.generic import ListView

from ..models import Class, Program, Student, StudentRegistration
from .api import *  # noqa
from .signup import *  # noqa
from .studentreg import *  # noqa
from .teacherreg import *  # noqa


class StudentsView(ListView):
    template_name = "core/students.html"
    context_object_name = "students"
    model = Student

    def get_queryset(self):
        return StudentRegistration.objects.filter(program__name=self.kwargs["program"]).filter(
            program__edition=self.kwargs["edition"]
        )


class ClassesView(ListView):
    template_name = "core/classes.html"
    context_object_name = "classes"
    model = Class

    def get_queryset(self):
        return Class.objects.filter(program__name=self.kwargs["program"]).filter(
            program__edition=self.kwargs["edition"]
        )


def index(request):
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}
    return render(request, "core/index.html", context)


def studentdashboard(request):
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}
    return render(request, "core/studentdashboard.html", context)
