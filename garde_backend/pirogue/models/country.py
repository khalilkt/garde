from django.db import models
from rest_framework import serializers

class Country(models.Model):
    code = models.IntegerField(unique=True)
    alpha2 = models.CharField(max_length=2, unique=True)
    alpha3 = models.CharField(max_length=3, unique=True)
    name_fr = models.CharField(max_length=45)
    name_en = models.CharField(max_length=45)

    class Meta:
        ordering = ('name_fr',)


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

