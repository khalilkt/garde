from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework import serializers
from authentication.models import UserSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated, NOT, AllowAny, BasePermission
from authentication.models import User

from rest_framework import viewsets

# Create your views here.

class UsersViewSet(viewsets.ModelViewSet): 
    serializer_class = UserSerializer 
    queryset = User.objects.all() 
    permission_classes = [IsAdminUser]


def get_response(user : User, token : Token):
    return Response({
        'token': token.key,
        "user" : UserSerializer(user).data,
    })

class LoginTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        if token is None:
            return Response({"error" : "Token is required"}, status=400)
        try:
            token = Token.objects.get(key=token)
        except Token.DoesNotExist:
            return Response({"error" : "Invalid token"}, status=400)
        
        user : User = token.user

        return get_response(user, token)
      
class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return get_response(user, token)

class UsersViewSet(viewsets.ModelViewSet): 
    serializer_class = UserSerializer 
    queryset = User.objects.all() 
    permission_classes = [IsAdminUser]
