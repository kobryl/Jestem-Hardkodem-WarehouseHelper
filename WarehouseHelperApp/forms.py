from django import forms

from WarehouseHelperApp.models import Product


class CSVUploadForm(forms.Form):
    csv_file = forms.FileField()


class OrderForm(forms.Form):
    product = forms.ModelChoiceField(
        queryset=Product.objects.all(),
        to_field_name='name',
        required=True,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    quantity = forms.IntegerField(
        widget=forms.NumberInput(attrs={'placeholder': 'quantity'})
    )


OrderFormset = forms.formset_factory(OrderForm, extra=1)
