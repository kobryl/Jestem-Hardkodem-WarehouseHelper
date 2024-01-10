from django.db import models


class Product(models.Model):
    """
    Product represents a single product type in the warehouse.
    """
    name = models.CharField(max_length=50)
    weight = models.IntegerField()  # in kg
    length = models.IntegerField()  # in mm
    width = models.IntegerField()  # in mm
    height = models.IntegerField()  # in mm

    def __str__(self):
        return self.name + f", weight: {self.weight} kg, size [mm]: " \
                           f"{self.length}x{self.width}x{self.height}"


class Order(models.Model):
    """
    Order represents a single order to complete.
    """

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    """
    OrderItem represents a single position in an Order.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    def __str__(self):
        return self.product.name + f" {self.quantity}"


class ProductLocation(models.Model):
    """
    ProductLocation represents the location of a Product in the warehouse.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location = models.CharField(max_length=7)

    class Meta:
        unique_together = ('product', 'location')

    def __str__(self):
        return self.location


class Route(models.Model):
    """
    Existence of Route for Order means that Order is
    ready to be processed, e.g. the algorithm has produced
    the route and pallet procedure.
    """
    order = models.OneToOneField(Order, on_delete=models.CASCADE)

    def __str__(self):
        return f"Route for order {self.order.id}"
