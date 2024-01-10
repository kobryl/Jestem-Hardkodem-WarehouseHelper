from django.db import models


# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=50)
    weight = models.IntegerField()
    length = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()

    def __str__(self):
        return self.name + f", weight: {self.weight} kg, size [m]: {self.length}x{self.width}x{self.height}"


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return  self.product.name + f" {self.quantity}"


class ProductLocation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location = models.CharField(max_length=50)

    def __str__(self):
        return self.location