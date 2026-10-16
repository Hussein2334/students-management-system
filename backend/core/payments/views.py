from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import filters
from accounts.permissions import IsAdmin
from accounts.utils import log_activity
from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(ListCreateAPIView):
    """GET/POST /api/admin/payments/"""
    queryset = Payment.objects.select_related('student').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['reference', 'student__email', 'student__username', 'description']
    ordering_fields = ['created_at', 'amount', 'status']

    def perform_create(self, serializer):
        payment = serializer.save(created_by=self.request.user)
        log_activity(self.request, self.request.user, 'create', 'Payment', payment.id,
                     f'Ameongeza malipo: {payment.reference} - TZS {payment.amount}')


class PaymentDetailView(RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/admin/payments/<id>/"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        payment = serializer.save()
        log_activity(self.request, self.request.user, 'update', 'Payment', payment.id,
                     f'Amehariri malipo: {payment.reference}')

    def perform_destroy(self, instance):
        log_activity(self.request, self.request.user, 'delete', 'Payment', instance.id,
                     f'Amefuta malipo: {instance.reference}')
        instance.delete()