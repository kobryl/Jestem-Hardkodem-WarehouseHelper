import csv

from WarehouseHelperApp.models import Product, OrderItem, ProductLocation, Order
from consts import PRODUCTS_FILE, LOCATIONS_FILE, ORDERS_DIR, ORDER_FILE_PREFIX, ORDER_COUNT


# Load products
with open(PRODUCTS_FILE) as csvfile:
    reader = csv.reader(csvfile)
    next(reader, None) # skip the headers
    for row in reader:
        size = row[3].split('x')
        print(size)
        _, created = Product.objects.get_or_create(
            id=row[0],
            name=row[1],
            weight=row[2],
            length=size[0],
            width=size[1],
            height=size[2]
        )

# Load locations
with open(LOCATIONS_FILE) as csvfile:
    reader = csv.reader(csvfile)
    next(reader, None)  # skip the headers
    for row in reader:
        print(row)
        _, created = ProductLocation.objects.get_or_create(
            product_id=row[1],
            location=row[0]
        )

# Load orders
for i in range(1, ORDER_COUNT + 1):
    with open(ORDERS_DIR / f"{ORDER_FILE_PREFIX}{i}.csv") as csvfile:
        reader = csv.reader(csvfile)
        next(reader, None)  # skip the headers
        order, _ = Order.objects.get_or_create(id=i)
        print(order)
        for row in reader:
            product = Product.objects.get(id=row[0])
            print(product)
            _, _ = OrderItem.objects.get_or_create(
                product=product,
                quantity=row[3],
                order=order
            )
