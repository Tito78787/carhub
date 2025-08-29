from django.urls import path
from . import views

from .views import home,add_to_compare,compare_view
from users.views import login_user, RegisterView
from cars.views import CarListAPIView

app_name = "cars" 

urlpatterns = [
    path('', views.home, name='home'),
    path('api/login/', login_user, name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path("cars/<slug:slug>/", views.car_detail, name="car_detail"),
    path("brands/<slug:slug>/", views.brand_cars, name="brand_cars"),
    path('cars/', views.car_list, name='car_list'),
    path('compare/<slug:slug>/', views.add_to_compare, name='add_to_compare'),
    path('compare/', views.compare_view, name='compare_view'),
    path("compare/remove/<slug:slug>/", views.remove_from_compare, name="remove_from_compare"),
    path("compare/clear/", views.clear_compare, name="clear_compare"),
]



