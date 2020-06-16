from django.urls import path
from django.views import generic

from . import views


app_name = 'core'
urlpatterns = [
    path('', views.index, name='index'), 
    path('profile/', views.StudentProfileView.as_view(), name='studentprofile'),
    path('medliab/', views.medliab, name='medliab'),
    path('waiver/', views.waiver, name='waiver'),
    path('students/', views.StudentsView.as_view(), name='students'),
    path('teacherreg/', views.TeacherRegistrationView.as_view(), name='teacherreg'),
]
