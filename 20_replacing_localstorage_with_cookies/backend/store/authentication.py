from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):

        raw_token = request.COOKIES.get("access_token")

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        user = self.get_user(validated_token)

        SessionAuthentication().enforce_csrf(request)

        return user, validated_token