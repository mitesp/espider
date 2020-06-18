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
    path('classes/', views.ClassesView.as_view(), name='classes'),
    path('studentclasses/', views.studentclasses, name='studentclasses'), #views.StudentClassesView.as_view()
    path('studentreg/', views.studentreg, name='studentreg')
]
