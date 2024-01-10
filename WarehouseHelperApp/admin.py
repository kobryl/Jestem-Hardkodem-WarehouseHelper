from django.contrib import admin

from WarehouseHelperApp import models

# Register your models here.

admin.site.register(models.Product)
admin.site.register(models.OrderItem)
admin.site.register(models.ProductLocation)