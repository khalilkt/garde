"""
URL configuration for garde_backend project.

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
from django.urls import path
from pirogue.views.pirogue import MigrationIrregularList, PirogueList, PirogueDetail, MyPirogueList
from pirogue.views.immigrant import ImmigrantList, ImmigrantDetail, ImmigrantsPDFExportView, PirogueImmigrantsList, ImmigrantStatsView
from authentication.views import LoginTokenView, LoginView, UsersViewSet
from pirogue.views.stats import StatsView, CoutriesView, CountriesDetailView

from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
# add /api/users/ to the router

# router.register(r'users', UsersViewSet, basename="users")

router.register(r'api/users', UsersViewSet, basename="users")


urlpatterns = [

    path('api/auth/token', LoginTokenView.as_view(), name="login-token"),
    path('api/auth/login', LoginView.as_view(), name="login"),

    # ADMIN
    path("api/pirogues/", PirogueList.as_view(), name="pirogue-list"),
    path("api/immigrants/", ImmigrantList.as_view(), name = "immigrant-list"),
    path('api/stats/', StatsView.as_view(), name="stats"), 
    path('api/stats/immigrants', ImmigrantStatsView.as_view(), name="immigrants-stats"),
    path("api/migration_irregular/", MigrationIrregularList.as_view(), name="migration-irregular-list"),
 
    # AGENT
    
    path("api/me/pirogues/", MyPirogueList.as_view(), name="my-pirogue-list"),

    # BOTH

    path("api/pirogues/<int:pk>/", PirogueDetail.as_view(), name="pirogue-detail"),
    path("api/immigrants/<int:pk>/", ImmigrantDetail.as_view(), name = "immigrant-detail"),  
    path('api/pirogues/<int:pirogue_pk>/immigrants/', PirogueImmigrantsList.as_view(), name="pirogue-immigrants-list"),

    path('api/countries/', CoutriesView.as_view(), name="countries-list"),
    path('api/countries/<int:pk>/', CountriesDetailView.as_view(), name="countries-detail"),

    path('api/immigrants/pdf', ImmigrantsPDFExportView.as_view(), name="immigrant-detail"),
    

]
from django.conf.urls.static import static

urlpatterns += router.urls
urlpatterns += static("api/" +  settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# ADMIN

# GET/POST /users/
# GET/PUT/DELETE /users/{id}
# GET /pirogues/
# GET /pirogues/{id}
# GET /pirogues/{id}/immigrants
# GET /immigrants/
# GET /immigrants/{id}
# GET /stats

# AGENT

# GET/POST /me/pirogues/
# GET/PUT/DELETE /me/pirogues/{id}
# GET/POST /me/pirogues/{id}/immigrants
# GET/PUT/DELETE /me/pirogues/{id}/immigrants/{id}



