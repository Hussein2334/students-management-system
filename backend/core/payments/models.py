from django.conf import settings
from django.db import models


class Payment(models.Model):
    """Malipo ya mwanafunzi."""
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'

    class Method(models.TextChoices):
        CASH = 'cash', 'Cash'
        MPESA = 'mpesa', 'M-Pesa'
        TIGO_PESA = 'tigo_pesa', 'Tigo Pesa'
        AIRTEL_MONEY = 'airtel_money', 'Airtel Money'
        HALOPESA = 'halopesa', 'HaloPesa'
        BANK = 'bank', 'Bank Transfer'

    reference = models.CharField(max_length=50, unique=True)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        limit_choices_to={'role': 'student'},
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=Method.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    description = models.TextField(blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='payments_created',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference} - {self.student} - {self.amount}"

    def save(self, *args, **kwargs):
        # Tengeneza reference kama haipo
        if not self.reference:
            import uuid
            self.reference = f"PAY-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)