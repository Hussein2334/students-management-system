from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'student', 'amount', 'method', 'status', 'created_at')
    list_filter = ('status', 'method', 'created_at')
    search_fields = ('reference', 'student__email', 'student__username')