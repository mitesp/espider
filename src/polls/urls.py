from django.urls import path
from django.views import generic

from . import views


app_name = 'polls'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.ResultsView.as_view(), name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
    path('form/', views.add_student, name='studentprofileform'),
    path('medliab/', views.medliab, name='medliab'),
    path('waiver/', views.waiver, name='waiver'),
    path('students/', views.StudentsView.as_view(), name='students')
]