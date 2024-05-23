from rest_framework.views import APIView, Response, status
from rest_framework.permissions import IsAdminUser
from rest_framework import serializers
from datetime import datetime
from authentication.models import User
from pirogue.models import Pirogue, Immigrant
from django.db.models import F, ExpressionWrapper, IntegerField
from dateutil.relativedelta import relativedelta
from datetime import date

from pirogue.models.country import Country

from django.db.models.functions import Extract

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
        immigrants = Immigrant.objects.def_queryset().annotate(nationality_code = F('nationality__name_fr')).filter(pirogue=obj)
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
    # start_date_epoch = start_date_epoch * 1000000
    # end_date_epoch = end_date_epoch * 1000000
    # ret = queryset.annotate(created_at_epoch =  ExpressionWrapper(F('created_at') - datetime(1970,1,1), output_field=IntegerField()))
    ret = queryset.annotate(created_at_epoch = Extract('created_at', 'epoch'))
    ret  = ret.filter(created_at_epoch__gte=start_date_epoch, created_at_epoch__lt=end_date_epoch)
    return ret

def get_immigrant_report(start_date_epoch, end_date_epoch, user = None):

    immigrants = filter_by_start_end_date(Immigrant.objects.def_queryset(), start_date_epoch, end_date_epoch)
    if user:
        immigrants = immigrants.filter(created_by=user)
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
      
        start_date_epoch = datetime.strptime(start_date, "%Y-%m").timestamp() 
        end_date_epoch = (datetime.strptime(end_date, "%Y-%m") + relativedelta(months=1)).timestamp() 
     
        pirogues = filter_by_start_end_date(Pirogue.objects.def_queryset(), start_date_epoch, end_date_epoch)
        immigrants_report = get_immigrant_report(start_date_epoch, end_date_epoch)
        # sss = Pirogue.objects.annotate(created_at_epoch =  ExpressionWrapper((F('created_at') - datetime(1970,1,1)).total_seconds(), output_field=IntegerField()))[:1]
        ret = {
            "pirogues" : PirogueRaportSerializer(pirogues, many=True).data,
            "immigrants" : immigrants_report,
            "start_date_epoch"  : start_date_epoch,
            "end_data_epoch" : end_date_epoch,
        }

        return Response(ret)



class GeneralReport (APIView):
    permission_classes = [IsAdminUser]

    def get(self, request): 
        immigrant_report_by_month = {}
        
        if not  "year" in request.query_params: 
            return Response({"error": "year is required"}, status=status.HTTP_400_BAD_REQUEST)
        year = request.query_params["year"] 
        if len(year) != 4:
            return Response({"error": "year must be in the format YYYY"}, status=status.HTTP_400_BAD_REQUEST)
        
        users = User.objects.all()
        for user in users:
            immigrant_report_by_month[user.city_name] = {}
            month = 1
            while month <= 12:  
                start_date = f"{year}-{month:02}" 
                end_date = f"{year}-{month+1:02}" if month < 12 else f"{int(year)+1:04}-01"
                start_date_epoch = datetime.strptime(start_date, "%Y-%m").timestamp()
                end_date_epoch = datetime.strptime(end_date, "%Y-%m").timestamp()

                month_report = get_immigrant_report(start_date_epoch, end_date_epoch, user = user )
                immigrant_report_by_month[user.city_name][month] = month_report
                month += 1


        pirogue_report_by_month = {}

        pirogues = Pirogue.objects.def_queryset()
        for user in users:
            pirogue_report_by_month[user.city_name] = {}
            month = 1
            while month <= 12:  
                start_date = f"{year}-{month:02}" 
                end_date = f"{year}-{month+1:02}" if month < 12 else f"{int(year)+1:04}-01"
                start_date_epoch = datetime.strptime(start_date, "%Y-%m").timestamp()
                end_date_epoch = datetime.strptime(end_date, "%Y-%m").timestamp()

                pirogues_report = filter_by_start_end_date(pirogues, start_date_epoch, end_date_epoch)
                pirogues_report = pirogues_report.filter(created_by=user)

                saisie = pirogues_report.filter(etat='saisie').count()
                casse = pirogues_report.filter(etat='casse').count()
                abandonnee = pirogues_report.filter(etat='abandonnee').count()
                pirogue_report_by_month[user.city_name][month] = {
                    "saisie" : saisie,
                    "casse" : casse,
                    "abandonnee" : abandonnee,
                }
                month += 1
        
        return Response({
            "immigrant_report" : immigrant_report_by_month,
            "pirogue_report" : pirogue_report_by_month,
        })
        
