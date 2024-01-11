"""
Views for WarehouseHelperApp
"""
import csv
import os

import django
from django.shortcuts import render, redirect

from WarehouseHelperApp.models import Product, ProductLocation, Order, OrderItem, Route
from WarehouseHelperApp.forms import CSVUploadForm, OrderForm, OrderFormset, RouteSelectionForm
from consts import ORDER_FILE_PREFIX, ORDERS_DIR, LOCATIONS_FILE, PRODUCTS_FILE, DEFAULT_PRIORITY


# Create your views here.

def index(request):
    """
    Main page
    """
    return render(request, 'index.html')


def import_products_from_csv(request):
    """
    Import products from CSV file form page
    """
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file'].read().decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)
            rows_to_save = []

            for row in csv_reader:
                print(row)
                size = row['Wymiary (mm)'].split('x')
                Product.objects.get_or_create(
                    id=row['ID Produktu'],
                    name=row['Nazwa Produktu'],
                    weight=row['Waga (kg)'],
                    length=size[0],
                    width=size[1],
                    height=size[2]
                )
                rows_to_save.append(row)

            with open(PRODUCTS_FILE, 'a', encoding='utf-8') as f:
                for row in rows_to_save:
                    f.write(f"{row['ID Produktu']},{row['Nazwa Produktu']},"
                            f"{row['Waga (kg)']},{row['Wymiary (mm)']}\n")

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_products_from_csv.html', {'form': form})


def import_locations_from_csv(request):
    """
    Import locations from CSV file form page
    """
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file'].read().decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)
            rows_to_save = []

            for row in csv_reader:
                ProductLocation.objects.get_or_create(
                    product_id=row['ID Produktu'],
                    location=row['Lokacja']
                )
                rows_to_save.append(row)

            with open(LOCATIONS_FILE, 'a', encoding='utf-8') as f:
                for row in rows_to_save:
                    f.write(f"{row['Lokacja']},{row['ID Produktu']}\n")

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_locations_from_csv.html', {'form': form})


def import_order_from_csv(request):
    """
    Import order from CSV file form page
    """
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            raw_file = request.FILES['csv_file'].read()
            csv_file = raw_file.decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)
            prepared_data = DEFAULT_PRIORITY + "\n"

            order = Order.objects.create()
            for row in csv_reader:
                OrderItem.objects.create(
                    product_id=row['ID Produktu'],
                    quantity=row['Ilość'],
                    order=order
                )
                product = Product.objects.get(id=row['ID Produktu'])
                prepared_data += f"{product.id} {product.weight} " \
                                 f"{product.length} {product.width} " \
                                 f"{product.height} " \
                                 f"{ProductLocation.objects.get(product=product)} " \
                                 f"{row['Ilość']}\n"

            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.csv", 'wb') as f:
                f.write(raw_file)

            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.txt", 'w') as f:
                f.write(prepared_data)

            os.startfile(f'path.exe', '', f'{ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}"}.txt')

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_order_from_csv.html', {'form': form})


def success(request):
    """
    Success page
    """
    return render(request, 'success.html')


def new_order(request):
    """
    New order form page
    """
    template_name = 'new_order.html'
    if request.method == 'POST':
        formset = OrderFormset(request.POST)
        if formset.is_valid():
            order = Order.objects.create()
            prepared_data = DEFAULT_PRIORITY + "\n"
            csv_data = 'ID Produktu,Nazwa Produktu,Lokacja,Ilość\n'
            for form in formset:
                product = Product.objects.get(id=form.cleaned_data['product'].id)
                OrderItem.objects.create(
                    product=product,
                    quantity=form.cleaned_data['quantity'],
                    order=order
                )
                csv_data += f"{product.id},{product.name}," \
                            f"{ProductLocation.objects.get(product=product)}," \
                            f"{form.cleaned_data['quantity']}\n"
                prepared_data += f"{product.id} {product.weight} " \
                                 f"{product.length} {product.width} " \
                                 f"{product.height} " \
                                 f"{ProductLocation.objects.get(product=product)} " \
                                 f"{form.cleaned_data['quantity']}\n"

            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.csv", 'w',
                      encoding='utf-8') as f:
                f.write(csv_data)
            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.txt", 'w') as f:
                f.write(prepared_data)
            os.startfile(f'path.exe', '', f'{ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}"}.txt')
            return redirect('success')
    else:
        formset = OrderFormset(request.GET or None)

    return render(request, template_name, {'formset': formset})


def view_route(request):
    """
    View routee page
    """
    form = RouteSelectionForm(request.GET or None)
    if form.is_valid():
        order = form.cleaned_data['order']
        try:
            route = order.route
            return render(request, 'index.html', {'route': route})
        except Route.DoesNotExist:
            return render(request, 'view_routes.html', {
                'form': form,
                'error': f'Route for order #{order.id} is not ready yet. Please check again later.'
            }, status=425)
    return render(request, 'view_routes.html', {'form': form})
