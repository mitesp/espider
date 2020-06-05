from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.template import loader
from django.views import generic
from django.utils import timezone

from .models import Student, StudentProfileForm

def index(request):
    return render(request, "core/index.html")

def add_student(request):
    if request.method == "POST":
        form = StudentProfileForm(request.POST)
        if form.is_valid():
            model_instance = form.save(commit=False)
            model_instance.save()
            return HttpResponseRedirect(reverse('core:medliab'))
    else:
        form = StudentProfileForm()
        return render(request, "core/studentprofile.html", {'form': form})

def medliab(request):
    if request.method == "POST":
        return HttpResponseRedirect(reverse('core:waiver'))
    else:
        return render(request, "core/medliab.html")

def waiver(request):
    if request.method == "POST":
        return HttpResponseRedirect(reverse('core:students'))
    else:
        return render(request, "core/waiver.html")


class StudentsView(generic.ListView):
    template_name = 'core/students.html'
    context_object_name = 'students'

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        return Student.objects.all()
