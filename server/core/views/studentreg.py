from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.generic import UpdateView

from ..forms import StudentClassRegistrationForm
from ..models import Class, ESPUser, Program, StudentClassRegistration, StudentRegistration


# helper function
def get_program_and_studentreg(name, edition, student):
    program = get_object_or_404(Program, name=name, edition=edition)
    studentreg, _ = StudentRegistration.objects.get_or_create(student=student, program=program)
    return program, studentreg


class StudentProfileView(LoginRequiredMixin, UpdateView):
    model = ESPUser
    fields = ("pronouns", "phone_number", "city", "state", "country")
    template_name = "core/profile.html"

    def get_object(self, queryset=None):
        return self.request.user

    def get_initial(self):
        return model_to_dict(self.request.user, fields=self.fields)

    def get_success_url(self):
        kwargs = {"program": self.kwargs["program"], "edition": self.kwargs["edition"]}
        return reverse("core:emergency_info", kwargs=kwargs)

    def form_valid(self, form):
        ret = super().form_valid(form)
        program, studentreg = get_program_and_studentreg(
            self.kwargs["program"], self.kwargs["edition"], self.request.user.student
        )
        studentreg.update_profile_check = True
        studentreg.save()
        return ret


@login_required
def studentclassreg(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )

    form = StudentClassRegistrationForm(
        request.POST, studentreg=studentreg, delete=False, program=program
    )
    if request.method == "POST" and form.is_valid():
        # submit student registration (add student to classes)
        chosen_classes = form.cleaned_data.get("classes")
        for clazzname in chosen_classes:
            clazz = Class.objects.filter(title__exact=clazzname)[0]
            StudentClassRegistration.objects.create(student=studentreg, clazz=clazz)
        return redirect(
            "core:studentregdashboard", program=kwargs["program"], edition=kwargs["edition"]
        )
    else:
        context = {"form": form, "program": program}
        return render(request, "core/studentreg/studentclassreg.html", context)


@login_required
def studentregdashboard(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )

    context = {"program": program, "studentreg": studentreg, "classes": studentreg.classes()}
    return render(request, "core/studentreg/studentregdashboard.html", context)


@login_required
def studentclasses(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )

    form = StudentClassRegistrationForm(
        request.POST, studentreg=studentreg, delete=True, program=program
    )
    if request.method == "POST" and form.is_valid():
        # submit update to student registration (remove student from classes)
        chosen_classes = form.cleaned_data.get("classes")

        for clazzname in chosen_classes:
            clazz = Class.objects.filter(title__exact=clazzname)[0]
            StudentClassRegistration.objects.get(student=studentreg, clazz=clazz).delete()
        return redirect(
            "core:studentregdashboard", program=kwargs["program"], edition=kwargs["edition"]
        )

    else:
        context = {"form": form, "program": program}
        return render(request, "core/studentreg/studentclasses.html", context)


# dummy forms


@login_required
def emergency_info(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )
    next_page = redirect("core:medliab", program=kwargs["program"], edition=kwargs["edition"])

    if request.method == "POST":
        studentreg.emergency_info_check = True
        studentreg.save()

        return next_page
    else:
        context = {"program": program}
        return render(request, "core/studentreg/emergency_info.html", context)


@login_required
def medliab(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )
    next_page = redirect("core:waiver", program=kwargs["program"], edition=kwargs["edition"])

    if request.method == "POST":
        studentreg.medliab_check = True
        studentreg.save()

        return next_page
    else:
        if studentreg.medliab_check:  # already filled out
            return next_page
        context = {"program": program}
        return render(request, "core/studentreg/medliab.html", context)


@login_required
def waiver(request, *args, **kwargs):
    program, studentreg = get_program_and_studentreg(
        kwargs["program"], kwargs["edition"], request.user.student
    )
    next_page = redirect(
        "core:studentregdashboard", program=kwargs["program"], edition=kwargs["edition"]
    )

    if request.method == "POST":
        studentreg.liability_check = True
        studentreg.save()

        return next_page
    else:
        if studentreg.liability_check:  # already filled out
            return next_page
        context = {"program": program}
        return render(request, "core/studentreg/waiver.html", context)
