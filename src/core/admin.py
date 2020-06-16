from django.contrib import admin

from .models import ESPUser, Student, Teacher

admin.site.register(ESPUser)
admin.site.register(Student)
admin.site.register(Teacher)
