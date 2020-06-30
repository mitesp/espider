from rest_framework import permissions


class StudentPermission(permissions.BasePermission):
    message = "This is a student-only action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student


class TeacherPermission(permissions.BasePermission):
    message = "This is a teacher-only action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_teacher


class StudentOrTeacherPermission(permissions.BasePermission):
    message = "Only students and teachers can perform this action."

    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_student or request.user.is_teacher
        )
