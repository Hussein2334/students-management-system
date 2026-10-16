from rest_framework import serializers
from .models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = (
            'id', 'user', 'user_name', 'user_email', 'user_role',
            'action', 'target_model', 'target_id',
            'description', 'ip_address', 'created_at',
        )
        read_only_fields = (
            'id', 'user', 'user_name', 'user_email', 'user_role',
            'action', 'target_model', 'target_id',
            'description', 'ip_address', 'created_at',
        )

    def get_user_name(self, obj):
        if not obj.user:
            return 'System'
        return obj.user.get_full_name() or obj.user.username

    def get_user_email(self, obj):
        return obj.user.email if obj.user else ''

    def get_user_role(self, obj):
        return obj.user.role if obj.user else ''