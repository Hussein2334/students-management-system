from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # AUTH
    RegisterView,
    LoginView,
    ProfileView,
    AvatarUploadView,
    AvatarDeleteView,
    PasswordResetRequestView,
    PasswordResetConfirmView,

    # ADMIN
    AdminStatsView,
    AdminUserListView,
    AdminUserDetailView,
    AdminToggleUserActiveView,
    ActivityLogView,

    # TEACHER
    TeacherStatsView,
    TeacherCourseListView,
    TeacherStudentListView,

    # STUDENT
    StudentStatsView,
    StudentCourseListView,
    StudentPaymentListView,
)

urlpatterns = [
    # ============ AUTH ============
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='avatar_upload'),
    path('profile/avatar/delete/', AvatarDeleteView.as_view(), name='avatar_delete'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ============ PASSWORD RESET ============
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # ============ ADMIN ============
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/users/<int:pk>/toggle-active/', AdminToggleUserActiveView.as_view(), name='admin_toggle_user'),
    path('admin/logs/', ActivityLogView.as_view(), name='admin_logs'),

    # ============ TEACHER ============
    path('teacher/stats/', TeacherStatsView.as_view(), name='teacher_stats'),
    path('teacher/courses/', TeacherCourseListView.as_view(), name='teacher_courses'),
    path('teacher/students/', TeacherStudentListView.as_view(), name='teacher_students'),

    # ============ STUDENT ============
    path('student/stats/', StudentStatsView.as_view(), name='student_stats'),
    path('student/courses/', StudentCourseListView.as_view(), name='student_courses'),
    path('student/payments/', StudentPaymentListView.as_view(), name='student_payments'),
]