from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import filters
from accounts.permissions import IsAdmin
from .models import Course
from .serializers import CourseSerializer


class CourseListCreateView(ListCreateAPIView):
    """GET/POST /api/admin/courses/"""
    queryset = Course.objects.select_related('teacher').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name', 'level', 'created_at']


class CourseDetailView(RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/admin/courses/<id>/"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]