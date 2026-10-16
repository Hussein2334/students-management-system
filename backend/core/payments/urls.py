from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView

urlpatterns = [
    path('admin/payments/', PaymentListCreateView.as_view(), name='payment_list'),
    path('admin/payments/<int:pk>/', PaymentDetailView.as_view(), name='payment_detail'),
]