from django.db import transaction
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.views.generic import CreateView, UpdateView

from ..models import Class, ESPUser, Program, TeacherClassRegistration, TeacherRegistration


class TeacherProfileView(UpdateView):
    model = ESPUser
    fields = ("pronouns", "phone_number", "city", "state", "country")
    template_name = "core/profile.html"
    # TODO figure out how to add affiliation to this

    def get_object(self, queryset=None):
        return self.request.user

    def get_initial(self):
        return model_to_dict(self.request.user, fields=self.fields)

    def get_success_url(self):
        kwargs = {"program": self.kwargs["program"], "edition": self.kwargs["edition"]}
        return reverse("core:teacherreg", kwargs=kwargs)

    def form_valid(self, form):
        program = get_object_or_404(
            Program, name=self.kwargs["program"], edition=self.kwargs["edition"]
        )
        teacherreg, _ = TeacherRegistration.objects.get_or_create(
            teacher=self.request.user.teacher, program=program
        )

        ret = super().form_valid(form)
        teacherreg.update_profile_check = True
        teacherreg.save()
        return ret


class TeacherRegistrationView(CreateView):
    model = Class
    fields = ("title", "description", "capacity")
    template_name = "core/teacherreg.html"

    @transaction.atomic
    def form_valid(self, form):
        program = get_object_or_404(
            Program, name=self.kwargs["program"], edition=self.kwargs["edition"]
        )
        form.instance.program = program
        clazz = form.save()
        teacherreg = TeacherRegistration.objects.get(
            teacher=self.request.user.teacher, program=program
        )
        TeacherClassRegistration.objects.create(teacher=teacherreg, clazz=clazz)
        return redirect(
            "core:classes", program=self.kwargs["program"], edition=self.kwargs["edition"]
        )
