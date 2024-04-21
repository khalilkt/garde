from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from pirogue.models import Immigrant, ImmigrantSerializer
from rest_framework.permissions import BasePermission
from pirogue.models import Pirogue
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter, BaseFilterBackend



class HasImmigrantPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user:
            return False
        if user.is_admin or user.is_superuser:
            return True
        obj: Immigrant
        return obj.created_by == user

class HasPirogueImmigrantsPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user:
            return False
        if user.is_admin or user.is_superuser:
            return True
        pirogue_pk = view.kwargs.get('pirogue_pk')
        if not pirogue_pk:
            return False
        pirogue = Pirogue.objects.get(pk=pirogue_pk)
        return pirogue.created_by == user

def get_immigrant_filterset_fields():
    return  ['pirogue', 'birth_country', 'nationality', 'created_by']
def get_immigrant_search_fields():
    return ['first_name', 'last_name']
def get_immigrant_ordering_fields():
    return ['first_name', 'last_name', 'date_of_birth', 'birth_country','nationality', 'created_by_name', 'created_by', 'pirogue_number', ]

class ImmigrantList(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Immigrant.objects.def_queryset()
    serializer_class = ImmigrantSerializer
    filterset_fields = get_immigrant_filterset_fields()
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()

class ImmigrantDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [HasImmigrantPermission]
    queryset = Immigrant.objects.def_queryset()
    serializer_class = ImmigrantSerializer

class PirogueImmigrantsList(ListCreateAPIView):
    serializer_class = ImmigrantSerializer
    permission_classes = [ HasPirogueImmigrantsPermission]
    filterset_fields = get_immigrant_filterset_fields()
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()

    def get_queryset(self):
        pirogue_pk = self.kwargs.get('pirogue_pk')
        return Immigrant.objects.def_queryset().filter(pirogue=pirogue_pk)