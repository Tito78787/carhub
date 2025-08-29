from django.contrib import admin

# Register your models here.
from .models import Car, Brand
admin.site.register(Car)
admin.site.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}