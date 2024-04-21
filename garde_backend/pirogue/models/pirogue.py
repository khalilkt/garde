from django.db import models    
from rest_framework import serializers
from django.db.models import Sum, Count, F
from django.db.models.functions import Coalesce

class PirogueManager(models.Manager):
    def def_queryset(self):
        return self.get_queryset().annotate(immigrants_count = Coalesce(Count("immigrants"), 0)).annotate(created_by_name = F('created_by__name'))

class Pirogue(models.Model):
    lat = models.DecimalField(max_digits=22, decimal_places=16)
    long = models.DecimalField(max_digits=22, decimal_places=16)
    number = models.CharField(max_length=10)
    departure = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('authentication.User', on_delete=models.PROTECT, related_name='pirogues')

    objects = PirogueManager()

class PirogueSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(read_only=True)
    immigrants_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Pirogue
        fields = '__all__'
        read_only_fields = ['created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)