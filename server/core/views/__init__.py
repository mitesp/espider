from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.views.generic import ListView

from ..models import Class, Program, StudentProfile, StudentRegistration
from .api import *  # noqa
from .signup import *  # noqa
from .studentreg import *  # noqa
from .teacherreg import *  # noqa


class StudentsView(LoginRequiredMixin, ListView):
    template_name = "core/adminlists/students.html"
    context_object_name = "students"
    model = StudentProfile

    def get_queryset(self):
        return StudentRegistration.objects.filter(program__name=self.kwargs["program"]).filter(
            program__edition=self.kwargs["edition"]
        )


class ClassesView(LoginRequiredMixin, ListView):
    template_name = "core/adminlists/classes.html"
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
    return render(request, "core/general/index.html", context)


@login_required
def studentdashboard(request):
    if not request.user.is_student:
        return redirect("core:index")
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}

    return render(request, "core/general/studentdashboard.html", context)


@login_required
def teacherdashboard(request):
    if not request.user.is_teacher:
        return redirect("core:index")
    programs = Program.objects.all()
    # TODO set up permissions so that only "active" programs are seen
    context = {"programs": programs}
    return render(request, "core/general/teacherdashboard.html", context)
