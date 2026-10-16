from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'level', 'teacher', 'credits', 'is_active')
    list_filter = ('level', 'is_active')
    search_fields = ('code', 'name')