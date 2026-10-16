from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Maelezo ya Ziada', {
            'fields': ('role', 'phone', 'avatar', 'bio', 'date_of_birth')
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Maelezo ya Ziada', {
            'fields': ('role', 'email', 'phone')
        }),
    )