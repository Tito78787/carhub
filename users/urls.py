from django.urls import path
from . import views

from .views import login_user,logout_user,RegisterView
app_name = 'users'

urlpatterns = [

    path('api/login/', login_user, name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('logout/', logout_user, name='logout'),
]
