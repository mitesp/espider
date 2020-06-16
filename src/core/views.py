from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.template import loader
from django.views import generic
from django.utils import timezone

from .models import Student

from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView, TemplateView

from .forms import StudentSignUpForm, TeacherSignUpForm, OtherAccountSignUpForm
from. models import ESPUser

class SignUpView(TemplateView):
    template_name = 'registration/signup.html'

class StudentSignUpView(CreateView):
    model = ESPUser
    form_class = StudentSignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'student'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('core:index')


class TeacherSignUpView(CreateView):
    model = ESPUser
    form_class = TeacherSignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'teacher'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('core:index')

class EducatorSignUpView(CreateView):
    model = ESPUser
    form_class = OtherAccountSignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'educator'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('core:index')

class ParentSignUpView(CreateView):
    model = ESPUser
    form_class = OtherAccountSignUpForm
    template_name = 'registration/signup_form.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'parent'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('core:index')

#OLD STUFF

def index(request):
    return render(request, "core/index.html")

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
