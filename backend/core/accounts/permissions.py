from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Ruhusu admin pekee."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsTeacher(BasePermission):
    """Ruhusu teacher pekee."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'


class IsStudent(BasePermission):
    """Ruhusu student pekee."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsAdminOrTeacher(BasePermission):
    """Ruhusu admin au teacher."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']


class IsTeacherOrAdmin(BasePermission):
    """Ruhusu teacher au admin."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin']