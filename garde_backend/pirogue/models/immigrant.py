from django.db import models    
from rest_framework import serializers
from django.db.models import F

class ImmigrantManager(models.Manager):
    def def_queryset(self): 
        ret =  self.get_queryset().annotate(created_by_name = F('created_by__name'))
        # .annotate(pirogue_number = F('pirogue__number'))
        ret = ret.annotate(nationality_name = F('nationality__name_fr')).annotate(birth_country_name = F('birth_country__name_fr'))
        return ret

class Immigrant(models.Model):
    name = models.CharField(max_length=100)
    etat = models.CharField(max_length=100, choices=[('alive', 'alive'), ('dead', 'dead'), ('sick_evacuation', 'sick_evacuation'), ('pregnant', 'pregnant')], default='alive')
    date_of_birth = models.DateField()  
    birth_country = models.ForeignKey('pirogue.Country', on_delete=models.PROTECT , related_name="immigrants_birth_country")
    nationality = models.ForeignKey('pirogue.Country', on_delete=models.PROTECT, related_name= "immigrants_nationality_country" )
    is_male = models.BooleanField()
    image = models.ImageField(upload_to='immigrants/', blank=True, null=True)
    pirogue = models.ForeignKey('pirogue.Pirogue', on_delete=models.CASCADE, related_name="immigrants")
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('authentication.User', on_delete=models.PROTECT, related_name='immigrants')

    objects = ImmigrantManager()

class ImmigrantSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='pirogue.created_by.username', read_only=True)
    pirogue_number = serializers.CharField( read_only=True)
    birth_country_name = serializers.CharField( read_only=True)
    nationality_name = serializers.CharField( read_only=True)

    class Meta:
        model = Immigrant
        fields = '__all__'
        read_only_fields = ['created_by']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
