from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Create superuser automatically from environment variables'

    def handle(self, *args, **options):
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not all([email, username, password]):
            self.stdout.write(self.style.WARNING('Superuser env vars hazipo. Ruka...'))
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} tayari yupo.'))
            return

        User.objects.create_superuser(
            email=email,
            username=username,
            password=password,
        )
        self.stdout.write(self.style.SUCCESS(f'Superuser {email} ameundwa!'))