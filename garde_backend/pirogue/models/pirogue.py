from django.db import models    
from rest_framework import serializers
from django.db.models import Sum, Count, F
from django.db.models.functions import Coalesce

class PirogueManager(models.Manager):
    def def_queryset(self):
        return self.get_queryset().annotate(immigrants_count = Coalesce(Count("immigrants"), 0)).annotate(created_by_name = F('created_by__name')).annotate(nationality_name = F('nationality__name_fr'))



class Pirogue(models.Model):
    number = models.CharField(max_length=100)
    lat = models.CharField(max_length=100, null= True, blank = True)
    long = models.CharField(max_length=100, null= True, blank = True)
    # numbers is a list of strings
    motor_numbers = models.JSONField(default=dict, blank = True)
    puissance = models.IntegerField(blank=True, null=True)
    material = models.CharField(max_length=100, choices=[('wood', 'wood'), ('metal', 'metal'), ('plastic', 'plastic'), ('polyester', 'polyester')], null= True, blank = True)
    nationality = models.ForeignKey('Country', on_delete=models.PROTECT, related_name='pirogues')
    brand = models.CharField(max_length=100, null= True, blank = True)
    gps = models.JSONField(default=list)
    # essence
    fuel = models.IntegerField(default=0)
    port = models.CharField(max_length=100, choices=[('ndagou', 'ndagou'), ('nouadhibou', 'nouadhibou'), ('nouakchott', 'nouakchott'), ('tanit', 'tanit'), ("unknown", "-")], )
    extra  = models.CharField(max_length=4000, default="", blank=True, null=True)
    days_at_sea = models.IntegerField(null=True, blank=True)

    sejour = models.IntegerField( null = True, blank = True)

    departure = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('authentication.User', on_delete=models.PROTECT, related_name='pirogues')
    etat = models.CharField(max_length=100, choices=[('saisie', 'saisie'), ('casse', 'casse'), ('abandonnee', 'abandonnee')], default='saisie')

    video = models.FileField(upload_to='pirogues/', blank=True, null=True)
    situation = models.CharField(max_length=1000 , default="", blank=True)

    objects = PirogueManager()

class PirogueSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(read_only=True)
    immigrants_count = serializers.IntegerField(read_only=True)
    nationality_name = serializers.CharField(read_only=True)

    class Meta:
        model = Pirogue
        fields = '__all__'
        read_only_fields = ['created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)