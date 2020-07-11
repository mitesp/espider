from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register("dashboard/teacher/", views.TeacherProgramViewSet)

app_name = "core"
urlpatterns = [
    # TODO: these paths are kinda messy -- we should read about API design and clean this up.
    path("api/", include(router.urls)),
    path("api/<program>/<edition>/catalog/", views.ClassCatalog.as_view()),
    # Dashboard
    path("api/dashboard/student/", views.get_student_dashboard),
    # Profile
    path("api/profile/student/", views.Profile.as_view()),
    # studentreg
    path("api/<program>/<edition>/student/", views.StudentRegAPI.as_view()),
    path("api/<program>/<edition>/student/emergency_info/", views.EmergencyInfo.as_view()),
    path("api/<program>/<edition>/student/medliab/", views.MedicalLiability.as_view()),
    path("api/<program>/<edition>/student/waiver/", views.LiabilityWaiver.as_view()),
    path("api/<program>/<edition>/student/availability/", views.Availability.as_view()),
    path("api/<program>/<edition>/student/schedule/", views.StudentProgramClasses.as_view()),
    # auth API calls
    path("api/account/student/", views.StudentAccount.as_view()),
    path("api/user/", views.current_user),
    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    # for heroku
    re_path(".*", TemplateView.as_view(template_name="index.html"), name="react"),
]
