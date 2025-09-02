from django.shortcuts import render,redirect
from .models import Car, Brand
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
# Create your views here.
from rest_framework import viewsets
from .serializers import CarSerializer
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST
from .forms import CarForm  # we’ll create this form
from django.contrib import messages
from django.http import Http404

# cars/views.py
from rest_framework import generics


User = get_user_model()

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer


def home(request):
    brands = Brand.objects.all()
    featured_cars = Car.objects.filter(is_featured=True).order_by('-posted_on') # Only approved featured cars
    new_cars = Car.objects.filter(is_featured=True).order_by('-posted_on')[:3]  # Only approved new cars

    brands_json = json.dumps(
        [{'name': b.name, 'logo': b.logo.url} for b in brands]
    )

    return render(request, 'cars/home.html', {
        'featured_cars': featured_cars,
        'brands': brands,
        'brands_json': brands_json,
        'new_cars': new_cars
    })



class CarListAPIView(generics.ListAPIView):
    serializer_class = CarSerializer

    def get_queryset(self):
        queryset = Car.objects.filter(approved=True).order_by("-posted_on")  # newest first
        brand = self.request.query_params.get('brand')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        search = self.request.query_params.get('search')
        limit = self.request.query_params.get('limit')  # 👈 extra filter

        if brand:
            queryset = queryset.filter(make__icontains=brand)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if search:
            queryset = queryset.filter(model__icontains=search)

        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]   # 👈 only return this many cars
            except ValueError:
                pass

        return queryset



@api_view(['GET'])
def brand_list(request):
    brands = Car.objects.values_list('make', flat=True).distinct()
    return Response(sorted(brands))

def car_detail(request, slug):
    car = get_object_or_404(Car, slug=slug)

    # Only allow if approved OR user is owner/admin
    if not car.approved:
        if not (request.user.is_staff or car.owner == request.user):
            raise Http404("Car not found")  # Hide unapproved cars

    return render(request, "cardetail.html", {"car": car})


def brand_cars(request, slug):
    brand = get_object_or_404(Brand, slug=slug)
    cars = brand.cars.all()  # related_name="cars"
    return render(request, "cars/brand_cars.html", {"brand": brand, "cars": cars})



def car_list(request):
    # ✅ Only approved cars show up
    cars = Car.objects.filter(approved=True).order_by('-posted_on')  
    brands = Brand.objects.all()
    return render(request, 'cars/car_list.html', {'cars': cars, 'brands': brands})

def add_to_compare(request, slug):
    compare_list = request.session.get('compare_list', [])

    if slug not in compare_list:
        if len(compare_list) < 4:  # Limit to 4 cars
            compare_list.append(slug)

    request.session['compare_list'] = compare_list
    return redirect('cars:compare_view')


def compare_view(request):
    compare_list = request.session.get('compare_list', [])
    cars = Car.objects.filter(slug__in=compare_list)  # match by slug
    return render(request, 'cars/compare.html', {'cars': cars})



def remove_from_compare(request, slug):
    compare_list = request.session.get("compare_list", [])
    if slug in compare_list:
        compare_list.remove(slug)  # actually remove slug
        request.session["compare_list"] = compare_list  # save back to session
        request.session.modified = True
    return redirect("cars:compare_view")

@require_POST
def clear_compare(request):
    request.session.pop("compare_list", None)  # safely remove key if it exists
    request.session.modified = True            # mark session as changed
    return redirect("cars:compare_view")


def sell_car(request):
    if request.method == "POST":
        form = CarForm(request.POST, request.FILES)
        if form.is_valid():
            car = form.save(commit=False)
            car.owner = request.user if request.user.is_authenticated else None
            car.approved = False  # 🚫 Not public until admin approves
            car.save()
            messages.success(
                request,
                "✅ Your car listing has been submitted and is pending admin approval."
            )
            return redirect("cars:car_detail", slug=car.slug)
    else:
        form = CarForm()

    return render(request, "cars/sell_car.html", {"form": form})