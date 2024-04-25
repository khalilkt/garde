from rest_framework.views import APIView , Response
from pirogue.models import Pirogue, Immigrant, Country
from rest_framework import serializers
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import ListAPIView

from pirogue.models.country import CountrySerializer

class StatsSerializer(serializers.Serializer):
    total_pirogues = serializers.IntegerField
    total_immigrants = serializers.IntegerField

class CoutriesView(ListAPIView): 
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
        total_pirogues = Pirogue.objects.count()
        total_immigrants = Immigrant.objects.count()   
        return Response(StatsSerializer({
            'total_pirogues': total_pirogues,
            'total_immigrants': total_immigrants,
        }).data)      
        