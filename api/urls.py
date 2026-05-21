from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, TransportTypeViewSet, ApplicationViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'transport-types', TransportTypeViewSet, basename='transport-types')
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
]

