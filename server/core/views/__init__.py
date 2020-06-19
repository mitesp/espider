from django.shortcuts import redirect, render
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
    if request.user.is_authenticated and not request.user.is_superuser:
        if request.user.is_student and not request.user.is_teacher:
            return redirect("core:studentdashboard")
        elif not request.user.is_student and request.user.is_teacher:
            return redirect("core:studentdashboard")
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}
    return render(request, "core/index.html", context)


def studentdashboard(request):
    if not request.user.is_authenticated or not request.user.is_student:
        return redirect("core:index")
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}

    return render(request, "core/studentdashboard.html", context)


def teacherdashboard(request):
    if not request.user.is_authenticated or not request.user.is_teacher:
        return redirect("core:index")
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}
    return render(request, "core/teacherdashboard.html", context)
