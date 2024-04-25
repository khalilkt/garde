from datetime import date
from io import BytesIO
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from pirogue.models import Immigrant, ImmigrantSerializer
from rest_framework.permissions import BasePermission
from pirogue.models import Pirogue
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter, BaseFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response

# import static files
from django.templatetags.static import static

from django.conf import settings
from django.template.loader import render_to_string
from django.http import FileResponse, HttpResponse
from rest_framework.views import APIView
from dateutil.relativedelta import relativedelta 

from os import path

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
                ret = ret.filter(date_of_birth__gt = date.today() - relativedelta(years=+25))
            elif age == "major":
                ret = ret.filter(date_of_birth__lt = date.today() - relativedelta(years=+25))
        return ret

class ImmigrantStatsView (ImmigrantList):
    

    def get(self, request):
        ret = super().filter_queryset(super().get_queryset())
        total_males = ret.filter(is_male = True).count()
        total_females = ret.filter(is_male = False).count()
        response = {
            "total_males" : total_males, 
            "total_females" : total_females,
            "total" : total_females +  total_males
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
    
