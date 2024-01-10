import csv

from django.http import HttpResponse
from django.shortcuts import render, redirect

from WarehouseHelperApp.forms import CSVUploadForm, OrderForm, OrderFormset
import WarehouseHelperApp.models as models
from consts import ORDER_FILE_PREFIX, ORDERS_DIR, LOCATIONS_FILE, PRODUCTS_FILE


# Create your views here.

def index(request):
    return render(request, 'index.html')


def import_products_from_csv(request):
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file'].read().decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)
            rows_to_save = []

            for row in csv_reader:
                print(row)
                size = row['Wymiary (mm)'].split('x')
                models.Product.objects.get_or_create(
                    id=row['ID Produktu'],
                    name=row['Nazwa Produktu'],
                    weight=row['Waga (kg)'],
                    length=size[0],
                    width=size[1],
                    height=size[2]
                )
                rows_to_save.append(row)

            with open(PRODUCTS_FILE, 'a') as f:
                for row in rows_to_save:
                    f.write(f"{row['ID Produktu']},{row['Nazwa Produktu']},{row['Waga (kg)']},{row['Wymiary (mm)']}\n")

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_products_from_csv.html', {'form': form})


def import_locations_from_csv(request):
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file'].read().decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)
            rows_to_save = []

            for row in csv_reader:
                models.ProductLocation.objects.get_or_create(
                    product_id=row['ID Produktu'],
                    location=row['Lokacja']
                )
                rows_to_save.append(row)

            with open(LOCATIONS_FILE, 'a') as f:
                for row in rows_to_save:
                    f.write(f"{row['Lokacja']},{row['ID Produktu']}\n")

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_locations_from_csv.html', {'form': form})


def import_order_from_csv(request):
    if request.method == 'POST':
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            raw_file = request.FILES['csv_file'].read()
            csv_file = raw_file.decode('utf-8').splitlines()
            csv_reader = csv.DictReader(csv_file)

            order = models.Order.objects.create()
            for row in csv_reader:
                models.OrderItem.objects.create(
                    product_id=row['ID Produktu'],
                    quantity=row['Ilość'],
                    order=order
                )

            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.csv", 'wb') as f:
                f.write(raw_file)

            return redirect('success')
    else:
        form = CSVUploadForm()

    return render(request, 'import_order_from_csv.html', {'form': form})


def success(request):
    return render(request, 'success.html')


def new_order(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            product = models.Product.objects.get(name=form.cleaned_data['product_id'])
            order = models.Order.objects.create()
            models.OrderItem.objects.create(
                product=product,
                quantity=form.cleaned_data['quantity'],
                order=order
            )
            return redirect('success')
    else:
        form = OrderForm()

    template_name = 'new_order.html'
    if request.method == 'POST':
        formset = OrderFormset(request.POST)
        if formset.is_valid():
            order = models.Order.objects.create()
            csv_data = 'ID Produktu,Nazwa Produktu,Lokacja,Ilość\n'
            for form in formset:
                product = models.Product.objects.get(id=form.cleaned_data['product'].id)
                models.OrderItem.objects.create(
                    product=product,
                    quantity=form.cleaned_data['quantity'],
                    order=order
                )
                csv_data += f"{product.id},{product.name},{models.ProductLocation.objects.get(product=product)},{form.cleaned_data['quantity']}\n"

            with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{order.id}.csv", 'w') as f:
                f.write(csv_data)
            return redirect('success')
    else:
        formset = OrderFormset(request.GET or None)

    return render(request, template_name, {'formset': formset})
