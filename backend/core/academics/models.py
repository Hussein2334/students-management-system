from django.conf import settings
from django.db import models


class Course(models.Model):
    """Kozi au somo."""
    class Level(models.TextChoices):
        FORM_1 = 'form_1', 'Form 1'
        FORM_2 = 'form_2', 'Form 2'
        FORM_3 = 'form_3', 'Form 3'
        FORM_4 = 'form_4', 'Form 4'
        FORM_5 = 'form_5', 'Form 5'
        FORM_6 = 'form_6', 'Form 6'

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=Level.choices)
    credits = models.PositiveIntegerField(default=1)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='courses_taught',
        limit_choices_to={'role': 'teacher'},
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"