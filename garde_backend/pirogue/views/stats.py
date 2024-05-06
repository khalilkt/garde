from rest_framework.views import APIView , Response
from pirogue.models import Pirogue, Immigrant, Country
from rest_framework import serializers
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from pirogue.models.country import CountrySerializer
from django.db.models import Q
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
        total_immigrants = Immigrant.objects.filter(created_at__year=year).count()
        return Response(StatsSerializer({
            'total_pirogues': total_pirogues,
            'total_immigrants': total_immigrants,
        }).data)   
        
def get_year_stats(year):
    pirogue_query = Pirogue.objects.def_queryset()
    immigrant_query = Immigrant.objects.def_queryset()

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
    }

class ComparisonView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        s_stats = get_year_stats(2023)
        f_stats = get_year_stats(2024)
        return Response({
            "2023": s_stats,
            "2024": f_stats,
        })