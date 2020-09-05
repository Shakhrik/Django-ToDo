from django.shortcuts import render


# Create your views here.
def full_list(request):
    return render(request, 'frontend/index.html')