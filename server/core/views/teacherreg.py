from django.shortcuts import redirect
from django.views.generic import CreateView

from ..models import Class, Program, TeacherClassRegistration


class TeacherRegistrationView(CreateView):
    model = Class
    fields = ("title", "description", "capacity")
    template_name = "core/teacherreg.html"

    # TODO figure out how to make this atomic, so one db doesn't record unless the other does
    def form_valid(self, form):
        # TODO: actually handle program association
        form.instance.program, _ = Program.objects.get_or_create(name="HSSP", edition="1957")
        clazz = form.save()
        TeacherClassRegistration.objects.create(teacher=self.request.user.teacher, clazz=clazz)
        return redirect("core:classes")
