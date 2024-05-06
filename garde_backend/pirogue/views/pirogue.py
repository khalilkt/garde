from datetime import timedelta, timezone
import datetime
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, BasePermission

from pirogue.models.pirogue import Pirogue, PirogueSerializer
from rest_framework.response import Response

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
    return ['created_by', "nationality", "port", "material", ]

def get_pirogue_search_fields():
    return ["number", 'motor_numbers', 'departure', 'destination', 'lat', 'long']

def get_pirogue_ordering_fields():
    return ['motor_numbers', "number", 'departure', 'destination', "lat", "long", 'created_by', 'immigrants_count', "created_by_name"]

class PirogueList(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Pirogue.objects.def_queryset()
    serializer_class = PirogueSerializer
    filterset_fields = get_pirogue_filterset_fields()
    search_fields = get_pirogue_search_fields()
    ordering_fields = get_pirogue_ordering_fields()
    ordering = ['-created_at']

class PirogueStatsView (PirogueList):
    
    def get(self, request):
        ret = super().filter_queryset(super().get_queryset())
        year = 2024
        ret = ret.filter(created_at__year=year)

        total = ret.count()
        total_by_month = {}
        for i in range(1, 13):
            total_by_month[i] = ret.filter(created_at__month = i).count()
            
        nats =  {}
        for pirogue in ret:
            nat = pirogue.nationality
            if nat:
                if not nat.name_fr in nats:
                    nats[nat.name_fr] = 0
                nats[nat.name_fr] += 1

        top_nationalities = {}
        for nat in sorted(nats.items(), key=lambda x: x[1], reverse=True):
            top_nationalities[nat[0]] = nat[1]
        response = {
            "total" : total,
            "top_nationalities" : top_nationalities, 
            "total_by_month" : total_by_month 
        }
        return Response(response)

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

class MigrationIrregularList(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = PirogueSerializer
    ordering_fileds = ["created_at"]
    ordering = ["created_at"]  
    pagination_class = None

    def get_queryset(self):
        params = self.request.query_params
        created_at = params.get("created_at", None)
        q = Pirogue.objects.def_queryset()
        if created_at: 
            q = q.filter(created_at__date = created_at)
        return q
    
