from django.urls import path
from . import views as fronted_views


urlpatterns = [
    path('', fronted_views.full_list, name='full-list')
]