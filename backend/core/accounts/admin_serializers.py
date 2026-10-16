from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer ya admin kuona/kuhariri watumiaji wote."""
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'bio', 'date_of_birth',
            'is_active', 'is_staff', 'created_at', 'password',
        )
        read_only_fields = ('id', 'created_at')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance