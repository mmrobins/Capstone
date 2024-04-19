"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from . import views
admin.autodiscover()
from .views import TripRegistrationView, LotteryResultsView

# from rest_framework import generics, permissions, serializers
from rest_framework.urlpatterns import format_suffix_patterns
# from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

urlpatterns = [
    path('', views.welcome),
    path('admin/', admin.site.urls),
    path('login', views.login),
    path('signup', views.signup),
    path('test_token', views.test_token),
    path('logout', views.logout),
    path('profile', views.profile),
    path('mushrooms', views.mushroom_list),
    path('trips', views.trip_list),
    path('trips/<int:pk>', views.trip_detail, name='trip_detail'),
    path('trips/<int:trip_id>/register', TripRegistrationView.as_view()),
    path('trips/<int:trip_id>/results', LotteryResultsView.as_view()),
    #for testing only
    path('trips/<int:trip_id>/lottery', LotteryResultsView.as_view())
]
urlpatterns = format_suffix_patterns(urlpatterns)