from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, RegexValidator

class CustomUser(AbstractUser):
    # Логин уже есть в AbstractUser, добавляем валидацию
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9]{6,}$',
                message='Логин должен содержать только латинские буквы и цифры, минимум 6 символов'
            )
        ]
    )
    
    # Дополнительные поля
    patronymic = models.CharField('Отчество', max_length=100, blank=True, null=True)
    birth_date = models.DateField('Дата рождения', null=True, blank=True)
    phone = models.CharField('Телефон', max_length=20, blank=True)
    email = models.EmailField('Email', unique=True)
    
    def __str__(self):
        return self.username

class TransportType(models.Model):
    name = models.CharField('Вид транспорта', max_length=50)
    
    def __str__(self):
        return self.name


class Application(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in_progress', 'Идет обучение'),
        ('completed', 'Обучение завершено'),
    ]
    
    PAYMENT_CHOICES = [
        ('card', 'Банковская карта'),
        ('cash', 'Наличные'),
        ('online', 'Онлайн оплата'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='applications', verbose_name='Пользователь')
    transport_type = models.ForeignKey(TransportType, on_delete=models.SET_NULL, null=True, verbose_name='Вид транспорта')
    start_date = models.DateField('Дата начала обучения')
    payment_method = models.CharField('Способ оплаты', max_length=20, choices=PAYMENT_CHOICES)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    def __str__(self):
        return f"Заявка #{self.id} - {self.user.username}"

class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews', verbose_name='Пользователь')
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='review', verbose_name='Заявка')
    rating = models.IntegerField('Оценка', choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField('Отзыв', max_length=1000)
    created_at = models.DateTimeField('Дата отзыва', auto_now_add=True)
    
    def __str__(self):
        return f"Отзыв от {self.user.username} на заявку #{self.application.id}"