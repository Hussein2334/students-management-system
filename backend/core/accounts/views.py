from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView,   # 🆕
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import filters

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Count, Q

from .permissions import IsAdmin, IsTeacher, IsStudent, IsTeacherOrAdmin
from .admin_serializers import AdminUserSerializer
from .utils import log_activity
from .models import ActivityLog
from .log_serializers import ActivityLogSerializer

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    """Tengeneza JWT tokens kwa mtumiaji."""
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['email'] = user.email
    refresh['full_name'] = user.get_full_name() or user.username
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# ============================================================
# REGISTER
# ============================================================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)

            log_activity(
                request, user, 'create', 'User', user.id,
                f'Usajili mpya: {user.email} ({user.role})'
            )

            return Response(
                {
                    'message': 'Usajili umefanikiwa.',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': tokens,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# LOGIN
# ============================================================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)

            log_activity(
                request, user, 'login',
                description=f'{user.email} ameingia kama {user.role}'
            )

            return Response(
                {
                    'message': 'Umeingia kikamilifu.',
                    'user': UserSerializer(user, context={'request': request}).data,
                    'tokens': tokens,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# PROFILE
# ============================================================
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user, context={'request': request}).data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user, data=request.data, partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()

            log_activity(
                request, request.user, 'update', 'User', request.user.id,
                f'Amehariri wasifu wake'
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# AVATAR UPLOAD / DELETE
# ============================================================
class AvatarUploadView(APIView):
    """POST /api/auth/profile/avatar/ — pakia picha ya wasifu."""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('avatar')
        if not file:
            return Response(
                {'detail': 'Hakuna picha iliyopakiwa.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if file.size > 2 * 1024 * 1024:
            return Response(
                {'detail': 'Picha ni kubwa sana. Kiwango cha juu ni 2MB.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if file.content_type not in allowed:
            return Response(
                {'detail': 'Aina ya faili haikubaliki. Tumia JPG, PNG, au WebP.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.avatar:
            try:
                request.user.avatar.delete(save=False)
            except Exception:
                pass

        request.user.avatar = file
        request.user.save()

        log_activity(
            request, request.user, 'update', 'User', request.user.id,
            f'Amebadilisha picha ya wasifu'
        )

        avatar_url = None
        if request.user.avatar:
            try:
                avatar_url = request.build_absolute_uri(request.user.avatar.url)
            except Exception:
                pass

        return Response({
            'detail': 'Picha imepakiwa kikamilifu.',
            'avatar': avatar_url,
        }, status=status.HTTP_200_OK)


class AvatarDeleteView(APIView):
    """DELETE /api/auth/profile/avatar/delete/ — futa picha ya wasifu."""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        if request.user.avatar:
            try:
                request.user.avatar.delete(save=False)
            except Exception:
                pass
            request.user.avatar = None
            request.user.save()

            log_activity(
                request, request.user, 'update', 'User', request.user.id,
                f'Amefuta picha ya wasifu'
            )

        return Response({'detail': 'Picha imefutwa.'}, status=status.HTTP_200_OK)


# ============================================================
# PASSWORD RESET
# ============================================================
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

            subject = "Kurejesha Nenosiri - ShulePro"
            message = (
                f"Habari {user.first_name or user.username},\n\n"
                f"Umeomba kurejesha nenosiri lako kwenye ShulePro.\n\n"
                f"Bofya link hii kuweka nenosiri jipya:\n"
                f"{reset_link}\n\n"
                f"Kama hukuomba hili, puuza email hii.\n\n"
                f"Asante,\nTimu ya ShulePro"
            )

            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )

                log_activity(
                    request, user, 'password_reset', 'User', user.id,
                    f'Ameomba kurejesha nenosiri'
                )
            except Exception as e:
                return Response(
                    {"detail": f"Imeshindwa kutuma email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(
            {"detail": "Kama email ipo kwenye mfumo, tumekutumia link ya kurejesha nenosiri."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            log_activity(
                request, user, 'password_reset', 'User', user.id,
                f'Nenosiri limebadilishwa'
            )

            return Response(
                {"detail": "Nenosiri limebadilishwa kikamilifu. Unaweza kuingia sasa."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# ADMIN STATS
# ============================================================
class AdminStatsView(APIView):
    """GET /api/admin/stats/"""
    permission_classes = [IsAdmin]

    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models.functions import TruncMonth

        total_users = User.objects.count()
        total_students = User.objects.filter(role='student').count()
        total_teachers = User.objects.filter(role='teacher').count()
        total_admins = User.objects.filter(role='admin').count()
        active_users = User.objects.filter(is_active=True).count()
        inactive_users = User.objects.filter(is_active=False).count()

        week_ago = timezone.now() - timedelta(days=7)
        new_this_week = User.objects.filter(created_at__gte=week_ago).count()

        six_months_ago = timezone.now() - timedelta(days=180)
        monthly = (
            User.objects
            .filter(created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        return Response({
            'total_users': total_users,
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_admins': total_admins,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'new_this_week': new_this_week,
            'monthly_growth': list(monthly),
        })


# ============================================================
# ADMIN USERS
# ============================================================
class AdminUserListView(ListCreateAPIView):
    """GET/POST /api/admin/users/"""
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'role']

    def perform_create(self, serializer):
        user = serializer.save()

        log_activity(
            self.request, self.request.user, 'create', 'User', user.id,
            f'Ameongeza mtumiaji: {user.email} ({user.role})'
        )


class AdminUserDetailView(RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/admin/users/<id>/"""
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        log_activity(
            request, request.user, 'update', 'User', instance.id,
            f'Amehariri mtumiaji: {instance.email}'
        )

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.role == 'admin' and User.objects.filter(role='admin').count() <= 1:
            return Response(
                {'detail': 'Hauwezi kufuta admin wa mwisho.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        log_activity(
            request, request.user, 'delete', 'User', user.id,
            f'Amefuta mtumiaji: {user.email} ({user.role})'
        )

        return super().destroy(request, *args, **kwargs)


class AdminToggleUserActiveView(APIView):
    """POST /api/admin/users/<id>/toggle-active/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'Mtumiaji haipo.'}, status=404)

        if user == request.user:
            return Response(
                {'detail': 'Hauwezi kuzuia akaunti yako mwenyewe.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = not user.is_active
        user.save()

        log_activity(
            request, request.user, 'toggle_active', 'User', user.id,
            f'{"Amefungua" if user.is_active else "Amezuia"} mtumiaji: {user.email}'
        )

        return Response({
            'detail': f'Mtumiaji {"amefunguliwa" if user.is_active else "amezuiwa"}.',
            'is_active': user.is_active,
        })


# ============================================================
# ACTIVITY LOGS
# ============================================================
class ActivityLogView(APIView):
    """GET /api/admin/logs/ — orodha ya shughuli zote."""
    permission_classes = [IsAdmin]

    def get(self, request):
        queryset = ActivityLog.objects.select_related('user').all()

        search = request.query_params.get('search')
        action = request.query_params.get('action')

        if search:
            queryset = queryset.filter(
                Q(description__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__username__icontains=search) |
                Q(user__first_name__icontains=search)
            )
        if action:
            queryset = queryset.filter(action=action)

        limit = int(request.query_params.get('limit', 100))
        queryset = queryset[:limit]

        serializer = ActivityLogSerializer(queryset, many=True)
        return Response({'results': serializer.data, 'count': len(serializer.data)})


# ============================================================
# TEACHER STATS
# ============================================================
class TeacherStatsView(APIView):
    """GET /api/auth/teacher/stats/ — takwimu za mwalimu."""
    permission_classes = [IsTeacher]

    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models.functions import TruncMonth
        from academics.models import Course

        user = request.user

        my_courses = Course.objects.filter(teacher=user)
        total_courses = my_courses.count()
        active_courses = my_courses.filter(is_active=True).count()

        total_students = User.objects.filter(role='student').count()
        active_students = User.objects.filter(role='student', is_active=True).count()

        month_ago = timezone.now() - timedelta(days=30)
        new_students = User.objects.filter(
            role='student', created_at__gte=month_ago
        ).count()

        six_months_ago = timezone.now() - timedelta(days=180)
        monthly = (
            Course.objects
            .filter(teacher=user, created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        courses_by_level = (
            my_courses
            .values('level')
            .annotate(count=Count('id'))
            .order_by('level')
        )

        return Response({
            'total_courses': total_courses,
            'active_courses': active_courses,
            'total_students': total_students,
            'active_students': active_students,
            'new_students_this_month': new_students,
            'monthly_courses_growth': list(monthly),
            'courses_by_level': list(courses_by_level),
            'students_by_level': {},
        })


# ============================================================
# TEACHER COURSES
# ============================================================
class TeacherCourseListView(ListCreateAPIView):
    """GET/POST /api/auth/teacher/courses/ — kozi za mwalimu aliyeingia."""
    permission_classes = [IsTeacher]

    def get_queryset(self):
        from academics.models import Course
        return Course.objects.filter(teacher=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        from academics.serializers import CourseSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        course = serializer.save(teacher=self.request.user)
        log_activity(
            self.request, self.request.user, 'create', 'Course', course.id,
            f'Ameongeza kozi: {course.code} - {course.name}'
        )


# ============================================================
# TEACHER STUDENTS
# ============================================================
class TeacherStudentListView(ListAPIView):
    """GET /api/auth/teacher/students/ — wanafunzi wote (kwa mwalimu)."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsTeacher]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']

    def get_queryset(self):
        return User.objects.filter(role='student').order_by('-created_at')



# ============================================================
# STUDENT STATS
# ============================================================
class StudentStatsView(APIView):
    """GET /api/auth/student/stats/ — takwimu za mwanafunzi."""
    permission_classes = [IsStudent]

    def get(self, request):
        from academics.models import Course
        from payments.models import Payment
        from django.db.models import Sum

        user = request.user

        # Kozi zote
        total_courses = Course.objects.filter(is_active=True).count()

        # Malipo yangu
        my_payments = Payment.objects.filter(student=user)
        total_payments = my_payments.count()
        paid_amount = my_payments.filter(status='paid').aggregate(
            total=Sum('amount')
        )['total'] or 0
        pending_amount = my_payments.filter(status='pending').aggregate(
            total=Sum('amount')
        )['total'] or 0

        # Malipo yaliyolipwa
        paid_count = my_payments.filter(status='paid').count()

        # Malipo kwa mwezi
        from django.utils import timezone
        from datetime import timedelta
        from django.db.models.functions import TruncMonth

        six_months_ago = timezone.now() - timedelta(days=180)
        monthly = (
            Payment.objects
            .filter(student=user, created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(
                count=Count('id'),
                total=Sum('amount'),
            )
            .order_by('month')
        )

        return Response({
            'total_courses': total_courses,
            'total_payments': total_payments,
            'paid_count': paid_count,
            'paid_amount': float(paid_amount),
            'pending_amount': float(pending_amount),
            'monthly_payments': list(monthly),
        })


# ============================================================
# STUDENT COURSES
# ============================================================
class StudentCourseListView(ListAPIView):
    """GET /api/auth/student/courses/ — kozi zote (kwa mwanafunzi)."""
    permission_classes = [IsStudent]

    def get_queryset(self):
        from academics.models import Course
        return Course.objects.filter(is_active=True).order_by('code')

    def get_serializer_class(self):
        from academics.serializers import CourseSerializer
        return CourseSerializer


# ============================================================
# STUDENT PAYMENTS
# ============================================================
class StudentPaymentListView(ListAPIView):
    """GET /api/auth/student/payments/ — malipo yangu."""
    permission_classes = [IsStudent]

    def get_queryset(self):
        from payments.models import Payment
        return Payment.objects.filter(student=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        from payments.serializers import PaymentSerializer
        return PaymentSerializer