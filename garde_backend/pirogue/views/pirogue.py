from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, BasePermission

from pirogue.models.pirogue import Pirogue, PirogueSerializer

class HasPiroguePermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user:
            return False
        if user.is_admin or user.is_superuser:
            return True 
        if obj.created_by == user:
            return True
        obj : Pirogue
        return obj.created_by == user


def get_pirogue_filterset_fields():
    return ['created_by']

def get_pirogue_search_fields():
    return ['number', 'departure', 'destination', 'lat', 'long']

def get_pirogue_ordering_fields():
    return ['number', 'departure', 'destination', "lat", "long", 'created_by', 'immigrants_count', "created_by_name"]

class PirogueList(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Pirogue.objects.def_queryset()
    serializer_class = PirogueSerializer
    filterset_fields = get_pirogue_filterset_fields()
    search_fields = get_pirogue_search_fields()
    ordering_fields = get_pirogue_ordering_fields()
    ordering = ['-created_at']


class PirogueDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [HasPiroguePermission]
    queryset = Pirogue.objects.def_queryset()
    serializer_class = PirogueSerializer

class MyPirogueList(ListCreateAPIView):
    serializer_class = PirogueSerializer
    filterset_fields = get_pirogue_filterset_fields()
    search_fields = get_pirogue_search_fields()
    ordering_fields = get_pirogue_ordering_fields()
    ordering = ['created_at']

    def get_queryset(self):
        return Pirogue.objects.def_queryset().filter(created_by=self.request.user)



