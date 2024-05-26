from datetime import date
from io import BytesIO
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from authentication.models import User
from pirogue.models import Immigrant, ImmigrantSerializer
from rest_framework.permissions import BasePermission
from pirogue.models import Pirogue
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter, BaseFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F
from rest_framework import serializers
from rest_framework.permissions import AllowAny
# import static files
from django.templatetags.static import static

from django.conf import settings
from django.template.loader import render_to_string
from django.http import FileResponse, HttpResponse
from rest_framework.views import APIView
from dateutil.relativedelta import relativedelta 
from datetime import datetime
from django.db.models import Count

from os import path

from pirogue.models.country import Country

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
    return  ['pirogue', 'birth_country', 'nationality', 'created_by', 'is_male', 'etat', 'free_at', 'criminal_record']
def get_immigrant_search_fields():
    return ['name']
def get_immigrant_ordering_fields():
    return ['name', 'date_of_birth', 'birth_country','nationality', 'created_by_name', 'created_by', 'pirogue_number']

class ImmigrantList(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Immigrant.objects.def_queryset()
    serializer_class = ImmigrantSerializer
    filterset_fields = get_immigrant_filterset_fields() 
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()
    ordering = ['-created_at']
   
    @property
    def pagination_class(self):
        if "date" in self.request.query_params:
            return None
        else:
            return super().pagination_class


    def filter_queryset(self, queryset):
        params = self.request.query_params
        ret =  super().filter_queryset(queryset)
        if "age" in params:
            age = params["age"]
            if age == "minor": 
                ret = ret.filter(age__lt = 18)
            elif age == "major":
                ret = ret.filter(age__gte = 18)
        
        date = params.get("date", None)
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
        
        is_criminal = params.get("is_criminal", None)
        if is_criminal:
            if is_criminal == "true":
                ret = ret.filter(is_criminal = True)
            elif is_criminal == "false":
                ret = ret.filter(is_criminal = False)
        
        is_free = params.get("is_free", None)
        if is_free:
            if is_free == "true":
                ret = ret.filter(free_at__isnull = False)
            elif is_free == "false":
                ret = ret.filter(free_at__isnull = True)
        return ret
    
class MyImmigrantsWoutPirogueList(ListCreateAPIView):
    serializer_class = ImmigrantSerializer
    ordering = ['-created_at']
    search_fields = get_immigrant_search_fields()

    def get_queryset(self):
        queryset = Immigrant.objects.def_queryset()
        queryset = queryset.filter(created_by=self.request.user, pirogue=None)
        return queryset

class ImmigrantStatsView (ImmigrantList):
    def get(self, request):
        # get year from search params 
        year = request.query_params.get('year', None)
        if not year:
            return Response("l'annee est obligatoir")
        ret = super().filter_queryset(super().get_queryset())
        ret = ret.filter(created_at__year=year)

        # group by nationality and for each one count the number

        top_nats = ret.values("nationality").annotate(name = F("nationality__name_fr")).annotate(total_immigrants = Count('id')).order_by('-total_immigrants')
        

        total_by_month = {}
        for i in range(1, 13):
            total_by_month[i] = ret.filter(created_at__month = i).count()
            
        
        total_males = ret.filter(is_male = True).count()
        total_females = ret.filter(is_male = False).count()
        response = {
            "total_males" : total_males, 
            "total_females" : total_females,
            "total" : total_females +  total_males,
            "total_by_month" : total_by_month ,
            "top_nationalities" : top_nats
        }
        return Response(response)

class ImmigrantsPDFExportView(ImmigrantList):
    def get(self, request):
        return Response("Not implemented")
            # buffer = BytesIO()

            # # Create a PDF document
            # doc = SimpleDocTemplate(buffer, pagesize=letter)
            # story = []

            # # Add heading with image
            # styles = getSampleStyleSheet()
            
            # base_dir = settings.BASE_DIR
            # img_path = path.join(base_dir, 'static', 'logo.png')

            # # add a 2px height line from left to right
            # story.append(Paragraph("<hr width='100%' size='2' color='black'>", styles['Normal']))

            # img = Image(img_path, width=100, height=100)
            # story.append(img)

            # story.append(Paragraph("Heading", styles['Heading1']))

            # # Add long table
            # data = [["Column 1", "Column 2", "Column 3"]]  # Example data
            # for i in range(100):  # Add 100 rows for demonstration
            #     data.append(["Row {}".format(i), "Value {}".format(i), "Description {}".format(i)])

            # table = Table(data)
            # table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            #                         ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            #                         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            #                         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            #                         ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            #                         ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            #                         ('GRID', (0, 0), (-1, -1), 1, colors.black)]))

            # story.append(table)

            # # Build the PDF
            # doc.build(story)

            # # Rewind the buffer
            # buffer.seek(0)

            # # Return the PDF as a response
            # return FileResponse(buffer, as_attachment=True, filename='example.pdf')

class ImmigrantDetail(RetrieveUpdateDestroyAPIView):
    permission_classes = [HasImmigrantPermission]
    queryset = Immigrant.objects.def_queryset()
    serializer_class = ImmigrantSerializer

    # overide delete
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = datetime.now()
        instance.save()
        return Response("ok")

class PirogueImmigrantsList(ListCreateAPIView):
    serializer_class = ImmigrantSerializer
    permission_classes = [ HasPirogueImmigrantsPermission]
    filterset_fields = get_immigrant_filterset_fields()
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()
    ordering = ['-created_at']

    @property
    def pagination_class(self):
        if "all" in self.request.query_params and self.request.query_params["all"] == "true":
            return None
        else:
            return super().pagination_class

    def get_queryset(self):
        pirogue_pk = self.kwargs.get('pirogue_pk')
        return Immigrant.objects.def_queryset().filter(pirogue=pirogue_pk)

COUTRIES = {
    "senegal" : "193",
    "mali" : "134",
    "gambi" : "82",
    "mauri" : "137"
    ,"bissau" :"176",
    "equat": "65",
    "ivoire" : "110",
    "sierra" : "195",
    "guinee" : "94",
    "togo" : "214",
    "ghana"  : "85",
    "nigeria" : "158",
    "soudan" : "205",
    "cameroun" : "36",
    "turc" : "220",
    "somali" : "200",
}

class ImmigrantBulkAdd(APIView):
    permission_classes = [AllowAny]
    def post(self, request):


        admin = User.objects.get(pk=1)
       
        data = request.data
        date = data.get("date", None)
        country = data.get("pirogue_nationality", None)
        departure = data.get("departure", None)
        destination = data.get("destination", None)
        etat = data.get("etat", "alive")


        if date is None or  country is None or   departure is None or  destination is None :
            return Response("Missing data" , status=400)
        
        created_at = datetime.strptime(date, "%Y-%m-%d")
        country_object = Country.objects.get(pk=COUTRIES[country])

        p = Pirogue(
            number = "--",
            departure = departure,
            destination = destination,
            nationality = country_object,
            created_at = created_at,
            created_by =admin
        )
        p.save()
        p.created_at = created_at
        p.save()


      

    # d = {
    #         "date" : "2023-06-27",
    #         "departure" : "Dakar",
    #         "destination" : "Bissau",
    #         "pirogue_nationality" : "gambi",
    #         "data" : {
    #             "gambi" : {
    #                 "total" : 122, 
    #                 "females" : 30,
    #                 "minors" : 10,
    #             },
    #             "mali" : {
    #                 "total" : 134,
    #             },
    #         }

    #     }

        countries_count = {}
        females_count = 0
        males_count = 0 
        minors_count = 0
        for key in data["data"]:
            country = key
            total = data["data"][key]["total"]
            females  = data["data"][key]["females"] or 0
            minors = data["data"][key]["minors"] or 0
            country_object = Country.objects.get(pk=COUTRIES[country])

            females_created = 0
            minor_created = 0
            for i in range (0, total):
                is_minor = minor_created < minors
                minor_created += 1 
                is_male = True
                if not is_minor and females_created < females:
                    is_male = False
                    females_created += 1
                
                
                date_of_birth  =  "2010-01-01" if is_minor else "1980-01-01"
                imm = Immigrant.objects.create(
                    name = "-",
                    etat = etat,
                    date_of_birth = date_of_birth,
                    nationality = country_object,
                    created_at = created_at,
                    is_male = is_male,
                    pirogue = p,
                    created_by =admin
                )
                imm.save()
                imm.created_at = created_at
                imm.save()
                countries_count[country] = countries_count.get(country, 0) + 1
                if is_minor:
                    minors_count += 1
                if is_male:
                    males_count += 1
                else:
                    females_count += 1
        response = {
            "total by country" : countries_count,
            "total" : males_count + females_count + minors_count,
            "total males" : males_count,
            "total females" : females_count,
            "total minors" : minors_count, 
            "total general" : Immigrant.objects.filter(deleted_at__isnull = True).count()
        }
        return Response(response)


        



        
class LiberationImmigrantSerializer(ImmigrantSerializer):
    departure = serializers.CharField( read_only=True, source="pirogue.departure")
    destination = serializers.CharField( read_only=True, source="pirogue.destination")

class ImmigrantLiberation(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Immigrant.objects.def_queryset().filter(free_at__isnull=True, is_criminal=False)
    serializer_class = LiberationImmigrantSerializer
    ordering = ['created_at']
    pagination_class = None

class BulkFreeImmigrationView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        data = request.data
        ids = data.get("ids", [])
        if not "free_at" in data:
            return Response("free_at is required", status=400)
        free_at = data["free_at"]
        if free_at is not None:
            free_at = datetime.strptime(free_at, "%Y-%m-%d")
        ret = Immigrant.objects.filter(pk__in=ids).update(free_at=free_at)
        return Response("ok")