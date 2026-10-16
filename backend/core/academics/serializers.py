from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Course

User = get_user_model()


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    level_display = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = Course
        fields = (
            'id', 'code', 'name', 'description', 'level', 'level_display',
            'credits', 'teacher', 'teacher_name', 'is_active',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_teacher_name(self, obj):
        if not obj.teacher:
            return None
        return obj.teacher.get_full_name() or obj.teacher.username