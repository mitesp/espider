from django.urls import path
from django.views import generic

from . import views


app_name = 'core'
urlpatterns = [
    path('', views.index, name='index'), 
    path('form/', views.add_student, name='studentprofileform'),
    path('medliab/', views.medliab, name='medliab'),
    path('waiver/', views.waiver, name='waiver'),
    path('students/', views.StudentsView.as_view(), name='students')
]
