from django.urls import include, path

from . import views

app_name = "core"
urlpatterns = [
    path("", views.index, name="index"),
    path(
        "accounts/",
        include(
            [
                path("", include("django.contrib.auth.urls")),
                path("signup/", views.SignUpPageView.as_view(), name="signup"),
                path("signup/student/", views.StudentSignUpView.as_view(), name="student_signup",),
                path("signup/teacher/", views.TeacherSignUpView.as_view(), name="teacher_signup",),
                path("signup/parent/", views.ParentSignUpView.as_view(), name="parent_signup",),
                path(
                    "signup/educator/", views.EducatorSignUpView.as_view(), name="educator_signup",
                ),
                path("profile/", views.index),
            ]
        ),
    ),
    path("profile/", views.StudentProfileView.as_view(), name="studentprofile"),
    path("medliab/", views.medliab, name="medliab"),
    path("waiver/", views.waiver, name="waiver"),
    path("students/", views.StudentsView.as_view(), name="students"),
    path("teacherreg/", views.TeacherRegistrationView.as_view(), name="teacherreg"),
    path("<program>/classes/", views.ClassesView.as_view(), name="classes"),
    path("studentclasses/", views.studentclasses, name="studentclasses"),
    path("studentreg/", views.studentreg, name="studentreg"),
]
