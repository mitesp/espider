from core.models import Program, StudentRegistration
from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    message = "This is a student-only action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student


class IsTeacher(permissions.BasePermission):
    message = "This is a teacher-only action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_teacher


class ProgramStudentRegOpen(permissions.BasePermission):
    message = "Student registration is not open for this program."

    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Program):
            return True
        return obj.student_reg_open


class StudentHasBegunRegistration(permissions.BasePermission):
    message = "You cannot perform this action until you have begun the registration process."

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Program):
            user = request.user
            return StudentRegistration.objects.filter(student=user, program=obj).exists()
        elif isinstance(obj, StudentRegistration):
            return True
        else:
            return True


class NoMedliabCheck(permissions.BasePermission):
    message = "You have already filled out the medical liability form."

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, StudentRegistration):
            return not obj.medliab_check
        elif isinstance(obj, StudentRegistration):
            return True
        else:
            return True


class NoLiabilityCheck(permissions.BasePermission):
    message = "You have already filled out the liability waiver."

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, StudentRegistration):
            return not obj.liability_check
        elif isinstance(obj, StudentRegistration):
            return True
        else:
            return True
