from core.forms import OtherAccountSignUpForm, StudentSignUpForm, TeacherSignUpForm
from core.models import ESPUser
from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView, TemplateView


class SignUpView(TemplateView):
    template_name = "registration/signup.html"


class StudentSignUpView(CreateView):
    model = ESPUser
    form_class = StudentSignUpForm
    template_name = "registration/signup_form.html"

    def get_context_data(self, **kwargs):
        kwargs["user_type"] = "student"
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect("core:index")


class TeacherSignUpView(CreateView):
    model = ESPUser
    form_class = TeacherSignUpForm
    template_name = "registration/signup_form.html"

    def get_context_data(self, **kwargs):
        kwargs["user_type"] = "teacher"
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect("core:index")


class EducatorSignUpView(CreateView):
    model = ESPUser
    form_class = OtherAccountSignUpForm
    template_name = "registration/signup_form.html"

    def get_context_data(self, **kwargs):
        kwargs["user_type"] = "educator"
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect("core:index")


class ParentSignUpView(CreateView):
    model = ESPUser
    form_class = OtherAccountSignUpForm
    template_name = "registration/signup_form.html"

    def get_context_data(self, **kwargs):
        kwargs["user_type"] = "parent"
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect("core:index")
