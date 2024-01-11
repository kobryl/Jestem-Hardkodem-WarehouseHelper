from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.http import urlencode

from WarehouseHelperApp import models

# Register your models here.

admin.site.register(models.Route)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'weight', 'length', 'width', 'height', 'location')
    search_fields = ('name',)

    def location(self, obj):
        location = models.ProductLocation.objects.filter(product=obj).first()
        if location:
            return location.location
        return "Not found"


@admin.register(models.ProductLocation)
class ProductLocationAdmin(admin.ModelAdmin):
    list_display = ('product', 'location')
    search_fields = ('product__name',)


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'view_items', 'route')
    search_fields = ('id',)

    def route(self, obj):
        route = models.Route.objects.filter(order=obj).first()
        if route:
            return route
        return "Not ready yet. Please check again later."

    def view_items(self, obj):
        count = models.OrderItem.objects.filter(order=obj).count()
        url = (
            reverse("admin:WarehouseHelperApp_orderitem_changelist")
            + "?"
            + urlencode({"order__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} Items</a>', url, count)


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'order')
    search_fields = ('product__name', 'order__id')
    list_filter = ('order__id',)

    def lookup_allowed(self, lookup, value, request=None):
        if lookup in ('order__id', 'order__id__exact'):
            return True
        return super().lookup_allowed(lookup, value)

    def product(self, obj):
        return obj.product.name
