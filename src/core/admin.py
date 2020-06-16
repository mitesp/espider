from django.contrib import admin

from .models import Class, ESPUser, Student, Teacher, TeacherClassRegistration

admin.site.register(Class)
admin.site.register(ESPUser)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(TeacherClassRegistration)
