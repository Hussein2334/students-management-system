from .models import ActivityLog


def log_activity(request, user, action, target_model='', target_id='', description=''):
    """Andika shughuli kwenye ActivityLog."""
    try:
        ip = (
            request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
            or request.META.get('REMOTE_ADDR')
        )
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        ActivityLog.objects.create(
            user=user,
            action=action,
            target_model=target_model,
            target_id=str(target_id) if target_id else '',
            description=description,
            ip_address=ip or None,
            user_agent=user_agent,
        )
    except Exception as e:
        print(f"Log error: {e}")