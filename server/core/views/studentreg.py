from core.forms import StudentClassRegistrationForm
from core.models import Class, ESPUser, Student, StudentClassRegistration
from django.forms.models import model_to_dict
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import UpdateView


class StudentProfileView(UpdateView):
    model = ESPUser
    fields = (
        "pronouns",
        "phone_number",
        "city",
        "state",
        "country",
    )
    template_name = "core/studentprofile.html"
    success_url = reverse_lazy("core:medliab")

    def get_object(self, queryset=None):
        return self.request.user

    def get_initial(self):
        return model_to_dict(self.request.user, fields=self.fields)


def studentreg(request):

    form = StudentClassRegistrationForm(request.POST, user=request.user, delete=False)
    if request.method == "POST" and form.is_valid():
        # submit student registration (add student to classes)
        chosen_classes = form.cleaned_data.get("classes")
        student = Student.objects.get(pk=request.user)
        for clazzname in chosen_classes:
            clazz = Class.objects.filter(title__exact=clazzname)[0]
            StudentClassRegistration.objects.create(student=student, clazz=clazz)
        return redirect("core:studentclasses")
    else:
        return render(request, "core/studentreg.html", {"form": form})


def studentclasses(request):

    form = StudentClassRegistrationForm(request.POST, user=request.user, delete=True)
    if request.method == "POST" and form.is_valid():
        # submit student registration (add student to classes)
        chosen_classes = form.cleaned_data.get("classes")
        student = Student.objects.get(pk=request.user)
        for clazzname in chosen_classes:
            clazz = Class.objects.filter(title__exact=clazzname)[0]
            StudentClassRegistration.objects.filter(student__exact=student).filter(
                clazz__exact=clazz
            ).delete()
        return redirect("core:studentclasses")
    else:
        return render(request, "core/studentclasses.html", {"form": form})


def medliab(request):
    if request.method == "POST":
        # TODO do something for medliab submission
        return redirect("core:waiver")
    else:
        return render(request, "core/medliab.html")


def waiver(request):
    if request.method == "POST":
        # TODO do something for waiver submission
        return redirect("core:studentreg")
    else:
        return render(request, "core/waiver.html")
