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

from rest_framework.permissions import AllowAny
# import static files
from django.templatetags.static import static

from django.conf import settings
from django.template.loader import render_to_string
from django.http import FileResponse, HttpResponse
from rest_framework.views import APIView
from dateutil.relativedelta import relativedelta 
from datetime import datetime

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
    return  ['pirogue', 'birth_country', 'nationality', 'created_by', 'is_male', 'etat' ]
def get_immigrant_search_fields():
    return ['name']
def get_immigrant_ordering_fields():
    return ['name', 'date_of_birth', 'birth_country','nationality', 'created_by_name', 'created_by', 'pirogue_number', ]

class ImmigrantList(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Immigrant.objects.def_queryset()
    serializer_class = ImmigrantSerializer
    filterset_fields = get_immigrant_filterset_fields()
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()
    ordering = ['-created_at']

    def filter_queryset(self, queryset):
        params = self.request.query_params
        ret =  super().filter_queryset(queryset)
        if "age" in params:
            age = params["age"]
            if age == "minor": 
                ret = ret.filter(age__lt = 18)
            elif age == "major":
                ret = ret.filter(age__gte = 18)
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
        ret = super().filter_queryset(super().get_queryset())
        total_by_month = {}
        for i in range(1, 13):
            total_by_month[i] = ret.filter(created_at__month = i).count()
            
        
        total_males = ret.filter(is_male = True).count()
        total_females = ret.filter(is_male = False).count()
        response = {
            "total_males" : total_males, 
            "total_females" : total_females,
            "total" : total_females +  total_males,
            "total_by_month" : total_by_month 
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

class PirogueImmigrantsList(ListCreateAPIView):
    serializer_class = ImmigrantSerializer
    permission_classes = [ HasPirogueImmigrantsPermission]
    filterset_fields = get_immigrant_filterset_fields()
    search_fields = get_immigrant_search_fields()
    ordering_fileds = get_immigrant_ordering_fields()

    def get_queryset(self):
        pirogue_pk = self.kwargs.get('pirogue_pk')
        return Immigrant.objects.def_queryset().filter(pirogue=pirogue_pk)
    

# senegal : 193
# mali : 134
# gambi : 82
# mauri : 137

# remove a natinoality
# remove 49 woman create at 2023-06-27 (gambi)
class ImmigrantBulkAdd(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        before_count = Immigrant.objects.count()
        before_females_count = Immigrant.objects.filter(is_male = False).count()

        data = request.data
        created_at = data.get("created_at", None)
        country = data.get("country", None)
        total = data.get("total", None)
        females = data.get("females", None)
        minors = data.get("minors", None)
        departure = data.get("departure", None)
        destination = data.get("destination", None)
        etat = data.get("etat", None)


        if  created_at is None or  country is None or  total is None or  females is None or  minors is None or  departure is None or  destination is None or  etat is None:
            return Response("Missing data" , status=400)

        created_at = datetime.strptime(created_at, "%Y-%m-%d")
        country_object = Country.objects.get(pk=country)

        admin = User.objects.get(pk=1)
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


        females_created = 0
        minor_created = 0
        for i in range (0, total):
            is_minor = minor_created < minors
            minor_created += 1 
            is_male = True
            if not is_minor and females_created < females:
                is_male = False
                females_created += 1
            
            
            date_of_birth  =  "2024-05-05" if is_minor else "1900-05-05"
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

        after_count = Immigrant.objects.count()
        females_count = Immigrant.objects.filter(is_male = False).count()
        return Response("Done. Before count: " + str(before_count) + " After count: " + str(after_count) + "(" + str(females_count)  +  ")" + " Added: " + str(after_count - before_count) + "(" + str(females_count - before_females_count) + ")")
        



        
