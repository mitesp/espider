from django.contrib.auth import login
from django.shortcuts import redirect
from django.views.generic import CreateView, TemplateView

from ..forms import ESPSignUpForm, StudentSignUpForm, TeacherSignUpForm


class SignUpPageView(TemplateView):
    template_name = "registration/signup.html"


class SignUpAndLogInView(CreateView):
    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect("core:index")


class StudentSignUpView(SignUpAndLogInView):
    form_class = StudentSignUpForm
    template_name = "registration/signup_form.html"
    extra_context = {"user_type": "student"}


class TeacherSignUpView(SignUpAndLogInView):
    form_class = TeacherSignUpForm
    template_name = "registration/signup_form.html"
    extra_context = {"user_type": "teacher"}


class EducatorSignUpView(SignUpAndLogInView):
    form_class = ESPSignUpForm
    template_name = "registration/signup_form.html"
    extra_context = {"user_type": "educator"}


class ParentSignUpView(SignUpAndLogInView):
    form_class = ESPSignUpForm
    template_name = "registration/signup_form.html"
    extra_context = {"user_type": "parent"}
