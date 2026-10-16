from django.urls import path
from .views import CourseListCreateView, CourseDetailView

urlpatterns = [
    path('admin/courses/', CourseListCreateView.as_view(), name='course_list'),
    path('admin/courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
]