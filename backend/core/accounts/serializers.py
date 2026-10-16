from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

User = get_user_model()


# ============================================================
# USER SERIALIZER
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    """Serializer ya kuonyesha taarifa za mtumiaji."""
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()    # 🆕

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'role', 'phone', 'avatar', 'bio',
            'date_of_birth', 'created_at',
        )
        read_only_fields = ('id', 'role', 'created_at')

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_avatar(self, obj):    # 🆕
        if not obj.avatar:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url


# ============================================================
# REGISTER SERIALIZER — kwa mwanafunzi pekee
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    """Serializer ya kujisajili — inaruhusu STUDENT pekee."""
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'first_name', 'last_name',
            'phone', 'date_of_birth', 'password', 'password2',
        )

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Barua pepe hii imetumika.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username hii imetumika.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Nenosiri hazifanani."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.role = User.Role.STUDENT
        user.set_password(password)
        user.save()
        return user


# ============================================================
# LOGIN SERIALIZER
# ============================================================
class LoginSerializer(serializers.Serializer):
    """Serializer ya kuingia kwa email + password."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Barua pepe au nenosiri si sahihi.")

        if not user.check_password(password):
            raise serializers.ValidationError("Barua pepe au nenosiri si sahihi.")

        if not user.is_active:
            raise serializers.ValidationError("Akaunti yako imezimwa.")

        attrs['user'] = user
        return attrs


# ============================================================
# PASSWORD RESET — Omba
# ============================================================
class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer ya kuomba reset — inatuma email yenye link."""
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


# ============================================================
# PASSWORD RESET — Thibitisha
# ============================================================
class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer ya kuweka nenosiri jipya kwa kutumia uid + token."""
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Nenosiri hazifanani."}
            )

        try:
            uid = force_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(
                {"token": "Link si sahihi au imeisha muda."}
            )

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError(
                {"token": "Link si sahihi au imeisha muda."}
            )

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user