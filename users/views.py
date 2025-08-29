from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework import viewsets
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import logout
from django.http import JsonResponse
from .serializers import RegisterSerializer
from rest_framework.views import APIView


User = get_user_model()





class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)  # depends on your backend

    if user is not None:
        login(request, user)
        return Response({'success': 'Logged in successfully'})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@csrf_exempt
def logout_user(request):
    logout(request)
    return Response({'success': 'Logged out successfully'})