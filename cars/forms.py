from django import forms
from .models import Car

class CarForm(forms.ModelForm):
    class Meta:
        model = Car
        fields = ["title", "brand", "model", "year", "price", "mileage", "image", "description"]

        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control", "placeholder": "Enter car title"}),
            "brand": forms.Select(attrs={"class": "form-select"}),
            "model": forms.TextInput(attrs={"class": "form-control", "placeholder": "Enter car model"}),
            "year": forms.NumberInput(attrs={"class": "form-control", "placeholder": "Enter car year"}),
            "price": forms.NumberInput(attrs={"class": "form-control", "placeholder": "Enter car price"}),
            "mileage": forms.NumberInput(attrs={"class": "form-control", "placeholder": "Enter car mileage"}),
            "image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "placeholder": "Enter car description", "rows": 4}),
        }
