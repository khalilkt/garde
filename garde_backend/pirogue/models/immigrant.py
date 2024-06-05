from django.db import models    
from rest_framework import serializers
from django.db.models import F
from datetime import date
from django.db.models import ExpressionWrapper, Func, DateTimeField, IntegerField, DateField, DurationField, FloatField, Case, When, Value, Q
from django.db.models.functions import ExtractYear

class ImmigrantManager(models.Manager):
    def def_queryset(self): 
        ret =  self.get_queryset().annotate(created_by_name = F('created_by__name')).annotate(pirogue_number = F('pirogue__number'))
        ret = ret.annotate(nationality_name = F('nationality__name_fr')).annotate(birth_country_name = F('birth_country__name_fr'))
        now = date.today()
        ret = ret.annotate(
            is_criminal = Case(
                When(criminal_record__isnull=True, then=Value(False)),
                When(criminal_record__exact='', then=Value(False)),
                default=Value(True),
            )
        )
        ret = ret.annotate(age = Case(
            When(date_of_birth__isnull=True, then=Value(None)),
            When(Q(date_of_birth__month__lte = now.month) |(Q(date_of_birth__month = now.month) & Q(date_of_birth__day__lte = now.day)), then=ExpressionWrapper(now.year - ExtractYear('date_of_birth', output_field=IntegerField()), output_field=IntegerField())),
            default=ExpressionWrapper(now.year - ExtractYear('date_of_birth', output_field=IntegerField()) - 1, output_field=IntegerField()),
            output_field=IntegerField()
        ))

        ret = ret.annotate(
            pirogue_sejour = F("pirogue__sejour")           )

        ret = ret.filter(deleted_at__isnull=True)

        return ret

class Immigrant(models.Model):
    name = models.CharField(max_length=100)
    etat = models.CharField(max_length=100, choices=[('alive', 'alive'), ('dead', 'dead'), ('sick_evacuation', 'sick_evacuation'), ('pregnant', 'pregnant')], default='alive')
    date_of_birth = models.DateField( null = True, blank = True)  
    birth_country = models.ForeignKey('pirogue.Country', on_delete=models.PROTECT , related_name="immigrants_birth_country", null = True, blank = True)
    nationality = models.ForeignKey('pirogue.Country', on_delete=models.PROTECT, related_name= "immigrants_nationality_country" , null = True, blank = True)
    is_male = models.BooleanField()
    image = models.ImageField(upload_to='immigrants/', blank=True, null=True)
    pirogue = models.ForeignKey('pirogue.Pirogue', on_delete=models.CASCADE, related_name="immigrants", null = True, blank = True)
    sejour = models.IntegerField( null = True, blank = True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('authentication.User', on_delete=models.PROTECT, related_name='immigrants')
    free_at = models.DateField( null = True, blank = True)
    deleted_at = models.DateTimeField( null = True, blank = True)
    birth_place = models.CharField(max_length=100, default="")
    criminal_record = models.CharField(max_length=100, null = True, choices=[
        ('theft', 'theft'),
        ('homocide', 'homocide'),
        ('torture', 'torture'),
        ('human_trafficking', 'human_trafficking'),
        ('other', 'other')

    ])
    criminal_note = models.TextField( blank = True, default="")
    
    objects = ImmigrantManager()

class ImmigrantSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField( read_only=True)
    pirogue_number = serializers.CharField( read_only=True)
    birth_country_name = serializers.CharField( read_only=True)
    nationality_name = serializers.CharField( read_only=True)
    age = serializers.CharField(read_only=True)
    pirogue_sejour = serializers.IntegerField(read_only=True)

    class Meta:
        model = Immigrant
        fields = '__all__'
        read_only_fields = ['created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
