from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in using email instead of username.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email") or username
        if email is None or password is None:
            return None
        try:
            user = User.objects.get(email=email)   # ✅ use email properly
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
