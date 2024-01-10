"""
URL configuration for WarehouseHelper project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path

from WarehouseHelperApp import views

urlpatterns = [
    path('', views.index, name='index'),
    path('import/products/', views.import_products_from_csv, name='import_products_from_csv'),
    path('success/', views.success, name='success'),
    path('import/locations/', views.import_locations_from_csv, name='import_locations_from_csv'),
    path('import/order/', views.import_order_from_csv, name='import_ordera_from_csv'),
]