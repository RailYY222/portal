from django.contrib import admin
from .models import CustomUser, TransportType, Application, Review

admin.site.register(CustomUser)
admin.site.register(TransportType)
admin.site.register(Application)
admin.site.register(Review)