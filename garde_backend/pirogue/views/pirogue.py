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
    return ['created_by', "nationality", "port", "material" ]

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

    @property
    def pagination_class(self):
        if "date" in self.request.query_params:
            return None
        else:
            return super().pagination_class

    def filter_queryset(self, queryset):
        ret =  super().filter_queryset(queryset)
        date = self.request.query_params.get("date", None)
        if date:
            splited = date.split("-")
            year = splited[0]
            month = splited[1] if len(splited) > 1 else None
            day = splited[2] if len(splited) > 2 else None
            if day is not None:
                ret = ret.filter(created_at__date=date)
            elif month is not None:
                ret = ret.filter(created_at__year=year, created_at__month=month)
            else:
                ret = ret.filter(created_at__year=year)
        
        is_mrt = self.request.query_params.get("is_mrt", None)
        if is_mrt:
            if is_mrt == "true":
                ret = ret.filter(nationality = "137")
            elif is_mrt == "false":
                ret = ret.exclude(nationality = "137")
        return ret

class PirogueStatsView (PirogueList):
    
    def get(self, request):
        ret = super().filter_queryset(super().get_queryset())
        
        year = request.query_params.get('year', None)
        if not year:
            return Response("l'annee est obligatoir")
        
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

    def patch(self, request, *args, **kwargs):
        # if created_at in the body update created_at in the object
        data = request.data
        if "created_at" in data:
            created_at = data["created_at"]
            instance = self.get_object()
            instance.created_at = created_at 
            instance.save()
        
        return super().patch(request, *args, **kwargs)

class MyPirogueList(ListCreateAPIView):
    serializer_class = PirogueSerializer
    filterset_fields = get_pirogue_filterset_fields()
    search_fields = get_pirogue_search_fields()
    ordering_fields = get_pirogue_ordering_fields()
    ordering = ['-created_at']

    def get_queryset(self):
        return Pirogue.objects.def_queryset().filter(created_by=self.request.user)

class MigrationIrregularList(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = PirogueSerializer
    ordering_fileds = ["created_at"]
    ordering = ["-created_at"]  
    pagination_class = None

    def get_queryset(self):
        params = self.request.query_params
        created_at = params.get("created_at", None)
        q = Pirogue.objects.def_queryset()
        if created_at: 
            q = q.filter(created_at__date = created_at)
        return q