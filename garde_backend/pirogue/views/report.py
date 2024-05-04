from rest_framework.views import APIView, Response, status
from rest_framework.permissions import IsAdminUser
from rest_framework import serializers
from datetime import datetime
from pirogue.models import Pirogue, Immigrant
from django.db.models import F, ExpressionWrapper, IntegerField
from dateutil.relativedelta import relativedelta
from datetime import date

from pirogue.models.country import Country


class NationalitySerializer(serializers.Serializer):
    name = serializers.CharField() 
    males = serializers.IntegerField()
    females = serializers.IntegerField()
    minors = serializers.IntegerField()

class PirogueRaportSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d")
    immigrants_count = serializers.IntegerField()
    departure = serializers.CharField()
    nationalities = serializers.SerializerMethodField('get_nationalities')
    created_at_epoch = serializers.IntegerField()
    
    def get_nationalities(self, obj):
        ret = {}
        immigrants = Immigrant.objects.def_queryset().annotate(nationality_code = F('nationality__alpha3')).filter(pirogue=obj)
        for immigrant in immigrants:
            code  = immigrant.nationality_code or None
            if not code in ret:
                ret[code] = {
                    "males" : 0,
                    "females" : 0,
                    "minors" : 0,
                    }
            if immigrant.age and immigrant.age < 18:
                ret[code]["minors"] += 1
            elif immigrant.is_male:
                ret[code]["males"] += 1
            else:
                ret[code]["females"] += 1

        return ret




    class Meta:
        model = Pirogue
        fields = ['created_at', 'immigrants_count', 'nationalities', 'departure', "created_at_epoch"]

def filter_by_start_end_date(queryset, start_date_epoch, end_date_epoch):
    ret = queryset.annotate(created_at_epoch =  ExpressionWrapper(F('created_at') - datetime(1970,1,1), output_field=IntegerField()))
    ret  = ret.filter(created_at_epoch__gte=start_date_epoch, created_at_epoch__lt=end_date_epoch)
    return ret

def get_immigrant_report(start_date_epoch, end_date_epoch):
    immigrants = filter_by_start_end_date(Immigrant.objects.def_queryset(), start_date_epoch, end_date_epoch)
    ret = {}
    for imm in immigrants: 
        nat = imm.nationality.id if imm.nationality else None
        if not nat in ret:
            ret[nat] = {
                "name" : imm.nationality.name_fr if imm.nationality else None,
                "males" : 0,
                "females" : 0,
                "minors" : 0,
            }
        
        if imm.age and imm.age < 18:
            ret[nat]["minors"] += 1
        elif imm.is_male:
            ret[nat]["males"] += 1
        else:
            ret[nat]["females"] += 1
       
    return ret
    

class ReportList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        params = request.query_params
        start_date = params.get('start', None)
        end_date = params.get('end', None) 
        if not start_date or not end_date:
            return Response({"error": "start and end dates are required"}, status=status.HTTP_400_BAD_REQUEST)
        if len(start_date) != 7 or len(end_date) != 7:   
            return Response({"error": "start and end dates must be in the format YYYY-MM"}, status=status.HTTP_400_BAD_REQUEST)
      
        start_date_epoch = datetime.strptime(start_date, "%Y-%m").timestamp() * 1000000
        end_date_epoch = (datetime.strptime(end_date, "%Y-%m") + relativedelta(months=1)).timestamp() * 1000000
     
        pirogues = filter_by_start_end_date(Pirogue.objects.def_queryset(), start_date_epoch, end_date_epoch)
        immigrants_report = get_immigrant_report(start_date_epoch, end_date_epoch)
        ret = {
            "pirogues" : PirogueRaportSerializer(pirogues, many=True).data,
            "immigrants" : immigrants_report
        }
        return Response(ret)



