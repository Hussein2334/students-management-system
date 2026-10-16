from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Payment

User = get_user_model()


class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    method_display = serializers.CharField(source='get_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = (
            'id', 'reference', 'student', 'student_name', 'student_email',
            'amount', 'method', 'method_display', 'status', 'status_display',
            'description', 'paid_at', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'reference', 'created_at', 'updated_at')

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username

    def get_student_email(self, obj):
        return obj.student.email