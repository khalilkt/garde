from rest_framework.views import APIView , Response
from pirogue.models import Pirogue, Immigrant, Country
from rest_framework import serializers
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.db.models import Count
from pirogue.models.country import CountrySerializer
from django.db.models import Q, F
class StatsSerializer(serializers.Serializer):
    total_pirogues = serializers.IntegerField
    total_immigrants = serializers.IntegerField

class CoutriesView(ListAPIView): 
    permission_classes = [AllowAny]
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    search_fields = ['name_fr', 'name_en', 'alpha2', 'alpha3', 'code']

class CountriesDetailView(APIView):
    def get(self, request, pk):
        country = Country.objects.get(pk=pk)
        return Response(CountrySerializer(country).data)

class StatsView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        year= 2024
        total_pirogues = Pirogue.objects.filter(created_at__year=year).count()
        total_immigrants = Immigrant.objects.filter(deleted_at__isnull = True).filter(created_at__year=year).count()
        return Response(StatsSerializer({
            'total_pirogues': total_pirogues,
            'total_immigrants': total_immigrants,
        }).data)   
        
def get_year_stats(year):
    pirogue_query = Pirogue.objects.def_queryset()
    immigrant_query = Immigrant.objects.def_queryset()  
    
    nats = immigrant_query.filter(created_at__year =year).values('nationality').annotate(total=Count('nationality')).annotate(name = F("nationality__name_fr")).order_by("-total")

    nationalities = {}
    for nat in nats:
        id = nat['nationality']
        nationalities[id] = {
            'name': nat['name'],
            'total': nat['total']
        }
    # males = is_male = True and (age is null or age >= 18)
    males = immigrant_query.filter(Q(is_male = True) & (Q(age__isnull = True) | Q(age__gte = 18) ) )
    females = immigrant_query.filter(Q(is_male = False) & (Q(age__isnull = True) | Q(age__gte = 18) ) )
    minors = immigrant_query.filter(is_male=True, age__isnull = False , age__lt = 18)
    
    return {
        'total_pirogues': pirogue_query.filter(created_at__year=year).count(),
        'total_immigrants' : immigrant_query.filter(created_at__year=year).count(),
        'total_females' : females.filter(created_at__year=year).count(),
        'total_males' : males.filter(created_at__year=year).count(),
        'total_minors' : minors.filter(created_at__year=year).count(), 
        'nationalities': nationalities,
    }

class ComparisonView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        s_stats = get_year_stats(2023)
        f_stats = get_year_stats(2024)
        nats = {}
        for nat in s_stats['nationalities']:
            if not nat in nats:
                nats[nat] = {
                    "name" : s_stats['nationalities'][nat]['name'],
                    "total" : 0,
                }
            nats[nat]['total'] += s_stats['nationalities'][nat]['total']
        for nat in f_stats['nationalities']:
            if not nat in nats:
                nats[nat] = {
                    "name" : f_stats['nationalities'][nat]['name'],
                    "total" : 0,
                }
            nats[nat]['total'] += f_stats['nationalities'][nat]['total']
     
        return Response({
            "data":{
                "2023": s_stats,
            "2024": f_stats,
            },
            "nationalities": nats
        })