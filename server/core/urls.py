from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
# TODO: This is currently broken -- will get fixed when we do teacher stuff
router.register("dashboard/teacher/", views.TeacherProgramViewSet)

app_name = "core"
urlpatterns = [
    path("api/", include(router.urls)),
    # Dashboard
    path("api/dashboard/student/", views.get_student_dashboard),
    # Profile
    path("api/profile/student/", views.Profile.as_view()),
    # program-specific
    path(
        "api/<program>/<edition>/",
        include(
            [
                path("catalog/", views.ClassCatalog.as_view()),
                # student registration
                path(
                    "student/",
                    include(
                        [
                            path("", views.StudentRegAPI.as_view()),
                            path("availability/", views.Availability.as_view()),
                            path("emergency_info/", views.EmergencyInfo.as_view()),
                            path("medliab/", views.MedicalLiability.as_view()),
                            path("schedule/", views.StudentProgramClasses.as_view()),
                            path("waiver/", views.LiabilityWaiver.as_view()),
                        ]
                    ),
                ),
            ]
        ),
    ),
    # auth API calls
    path("api/account/student/", views.StudentAccount.as_view()),
    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("api/user/", views.current_user),
    # Reroute all other paths to React frontend.
    # The pattern has a trailing slash so it doesn't accidentally catch patterns without trailing
    # slashes like "admin". (Django first checks "admin" and then checks "admin/" so we want to make
    # sure "admin" is not caught by the React pattern.)
    re_path("(^.*/$|^$)", TemplateView.as_view(template_name="index.html"), name="react"),
]
