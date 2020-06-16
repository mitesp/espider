from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse, reverse_lazy
from django.template import loader
from django.views import generic
from django.utils import timezone
from django.db import transaction

from .models import Student, Teacher

from django.contrib.auth import login
from django.forms.models import model_to_dict
from django.shortcuts import redirect
from django.views.generic import CreateView, TemplateView

from .forms import StudentSignUpForm, TeacherSignUpForm, OtherAccountSignUpForm, StudentClassRegistrationForm
from. models import Student, Class, ESPUser, StudentClassRegistration, TeacherClassRegistration

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


class StudentsView(generic.ListView):
    template_name = 'core/students.html'
    context_object_name = 'students'

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        return Student.objects.all()

class StudentProfileView(generic.UpdateView):
    model = ESPUser
    fields = ("pronouns", "phone_number", "city", "state", "country",)
    template_name = "core/studentprofile.html"
    success_url = reverse_lazy('core:medliab')

    def get_object(self, queryset=None):
        return self.request.user

    def get_initial(self):
        return model_to_dict(self.request.user, fields=self.fields)

class TeacherRegistrationView(CreateView):
    model = Class
    fields = ("title", "description", "capacity")
    template_name = 'core/teacherreg.html'

    #TODO figure out how to make this atomic, so one db doesn't record unless the other does
    def form_valid(self, form):
        userid = self.request.user
        teacher = Teacher.objects.get(pk=userid)
        clss = form.save(commit=False)
        clss.teacher = teacher
        TeacherClassRegistration.objects.create(teacher=self.request.user.teacher, clss=clss)
        clss.save()
        clss.save_m2m() #idk if this is necessary but https://docs.djangoproject.com/en/3.0/topics/forms/modelforms/#the-save-method suggests it is
        return redirect('core:classes')

class ClassesView(generic.ListView):
    template_name = 'core/classes.html'
    context_object_name = 'classes'

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        return Class.objects.all()

class StudentClassesView(generic.ListView):
    template_name = 'core/studentclasses.html'
    context_object_name = 'studentclasses'

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        user = self.request.user
        student = Student.objects.get(pk=user)
        classids = StudentClassRegistration.objects.filter(student__exact=student).values_list('clss', flat=True)
        classes = Class.objects.filter(pk__in=classids)
        return classes

def studentreg(request):

    form = StudentClassRegistrationForm(request.POST)
    if request.method == "POST" and form.is_valid():
        #submit student registration (add student to classes)
        chosen_classes = form.cleaned_data.get('classes')
        student = Student.objects.get(pk=request.user)
        for clssname in chosen_classes:
            clss = Class.objects.filter(title__exact=clssname)[0]
            reg = StudentClassRegistration.objects.create(student=student, clss=clss)
        return redirect('core:studentclasses')
    else:
        return render(request, "core/studentreg.html", {'form': form})


#OLD STUFF

def index(request):
    return render(request, "core/index.html")

def medliab(request):
    if request.method == "POST":
        #TODO do something for medliab submission
        return HttpResponseRedirect(reverse('core:waiver'))
    else:
        return render(request, "core/medliab.html")

def waiver(request):
    if request.method == "POST":
        #TODO do something for waiver submission
        return HttpResponseRedirect(reverse('core:studentreg'))
    else:
        return render(request, "core/waiver.html")