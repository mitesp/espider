from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register("classes", views.ClassViewSet)
router.register("programs", views.ProgramViewSet)

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
                path("profile/", views.index),  # TODO make this redirect to the home page somehow
            ]
        ),
    ),
    # student registration
    path(
        "<program>/<edition>/studentprofile/",
        views.StudentProfileView.as_view(),
        name="studentprofile",
    ),
    path("<program>/<edition>/emergency_info/", views.emergency_info, name="emergency_info"),
    path("<program>/<edition>/medliab/", views.medliab, name="medliab"),
    path("<program>/<edition>/waiver/", views.waiver, name="waiver"),
    path("<program>/<edition>/studentclassreg/", views.studentclassreg, name="studentclassreg"),
    path("<program>/<edition>/studentreg/", views.studentregdashboard, name="studentregdashboard"),
    path("<program>/<edition>/studentclasses/", views.studentclasses, name="studentclasses"),
    # teacher registration
    path(
        "<program>/<edition>/teacherprofile/",
        views.TeacherProfileView.as_view(),
        name="teacherprofile",
    ),
    path(
        "<program>/<edition>/teacherclassreg/",
        views.TeacherRegistrationView.as_view(),
        name="teacherclassreg",
    ),
    path("<program>/<edition>/teacherreg/", views.teacherregdashboard, name="teacherregdashboard"),
    # admin view pages
    path("<program>/<edition>/students/", views.StudentsView.as_view(), name="students"),
    path("<program>/<edition>/classes/", views.ClassesView.as_view(), name="classes"),
    # api paths
    path("api/current_user/", views.current_user),
    path("api/users/", views.UserList.as_view()),
    path("api/", include(router.urls)),
    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
]
