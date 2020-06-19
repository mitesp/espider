from django.urls import include, path

from . import views

app_name = "core"
urlpatterns = [
    # general pages
    path("", views.index, name="index"),
    path("studentdashboard", views.studentdashboard, name="studentdashboard"),
    path("teacherdashboard", views.teacherdashboard, name="teacherdashboard"),
    # accounts pages
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
    # student registration
    path(
        "<program>/<edition>/studentprofile/",
        views.StudentProfileView.as_view(),
        name="studentprofile",
    ),
    path("<program>/<edition>/medliab/", views.medliab, name="medliab"),
    path("<program>/<edition>/emergency_info/", views.emergency_info, name="emergency_info"),
    path("<program>/<edition>/waiver/", views.waiver, name="waiver"),
    path("<program>/<edition>/studentreg/", views.studentreg, name="studentreg"),
    path("<program>/<edition>/studentclasses/", views.studentclasses, name="studentclasses"),
    # teacher registration
    path(
        "<program>/<edition>/teacherprofile/",
        views.TeacherProfileView.as_view(),
        name="teacherprofile",
    ),
    path(
        "<program>/<edition>/teacherreg/",
        views.TeacherRegistrationView.as_view(),
        name="teacherreg",
    ),
    # admin view pages
    path("<program>/<edition>/students/", views.StudentsView.as_view(), name="students"),
    path("<program>/<edition>/classes/", views.ClassesView.as_view(), name="classes"),
]
