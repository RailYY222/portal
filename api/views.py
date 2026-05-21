from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .models import CustomUser, TransportType, Application, Review
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    TransportTypeSerializer, ApplicationSerializer, ReviewSerializer
)

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    
    @method_decorator(ensure_csrf_cookie)
    @action(detail=False, methods=['get'])
    def csrf(self, request):
        return Response({'csrfToken': 'set'})
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            # Добавляем информацию о правах админа в ответ
            user_data = UserSerializer(user).data
            user_data['is_admin'] = (user.username == 'Admin26' or user.is_superuser)
            return Response(user_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        logout(request)
        return Response({'message': 'Вы вышли из системы'})
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({'error': 'Не авторизован'}, status=status.HTTP_401_UNAUTHORIZED)

class TransportTypeViewSet(viewsets.ModelViewSet):
    queryset = TransportType.objects.all()
    serializer_class = TransportTypeSerializer
    permission_classes = [AllowAny]

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or (hasattr(user, 'username') and user.username == 'Admin26'):
            return Application.objects.all().order_by('-created_at')
        return Application.objects.filter(user=user).order_by('-created_at')
    
    queryset = Application.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def change_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['new', 'in_progress', 'completed']:
            application.status = new_status
            application.save()
            return Response(self.get_serializer(application).data)
        return Response({'error': 'Неверный статус'}, status=status.HTTP_400_BAD_REQUEST)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or (hasattr(user, 'username') and user.username == 'Admin26'):
            return Review.objects.all().order_by('-created_at')
        return Review.objects.filter(user=user)
    
    queryset = Review.objects.none()
    
    def create(self, request, *args, **kwargs):
        application_id = request.data.get('application')
        try:
            application = Application.objects.get(id=application_id, user=request.user)
            if application.status != 'completed':
                return Response({'error': 'Оставить отзыв можно только после завершения обучения'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            if hasattr(application, 'review'):
                return Response({'error': 'Отзыв для этой заявки уже оставлен'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        except Application.DoesNotExist:
            return Response({'error': 'Заявка не найдена'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
