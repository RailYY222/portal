from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, TransportType, Application, Review
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'password_confirm', 'email', 'first_name', 'last_name', 'patronymic', 'birth_date', 'phone']
    
    def validate_username(self, value):
        if not all(c.isalnum() for c in value):
            raise serializers.ValidationError("Логин должен содержать только латинские буквы и цифры")
        if len(value) < 6:
            raise serializers.ValidationError("Логин должен быть минимум 6 символов")
        return value
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль")
        return {'user': user}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'patronymic', 'birth_date', 'phone']

class TransportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportType
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    transport_type_name = serializers.CharField(source='transport_type.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user', 'created_at']