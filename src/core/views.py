from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.template import loader
from django.views import generic
from django.utils import timezone

from .models import Student, StudentProfileForm

from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView, TemplateView

from .forms import StudentSignUpForm, TeacherSignUpForm
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
        return redirect('students:quiz_list')


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
        return redirect('teachers:quiz_change_list')


#OLD STUFF

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
