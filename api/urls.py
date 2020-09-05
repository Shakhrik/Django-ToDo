from django.urls import path
from .import views as api_views

urlpatterns = [
    path('', api_views.apiOverview, name='api-overview'),
    path('task-list/', api_views.taskList, name='task-list'),
    path('task-detail/<str:pk>/', api_views.detailView, name='detali-view'),
    path('task-create', api_views.createTask, name='task-create'),
    path('task-update/<str:pk>/', api_views.task_update, name='task-update'),
    path('task-delete/<int:pk>/', api_views.delete_task, name='task-delete')

]
