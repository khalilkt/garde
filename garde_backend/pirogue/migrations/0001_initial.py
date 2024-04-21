# Generated by Django 5.0.4 on 2024-04-20 19:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.IntegerField(unique=True)),
                ('alpha2', models.CharField(max_length=2, unique=True)),
                ('alpha3', models.CharField(max_length=3, unique=True)),
                ('name_fr', models.CharField(max_length=45)),
                ('name_en', models.CharField(max_length=45)),
            ],
            options={
                'ordering': ('name_fr',),
            },
        ),
        migrations.CreateModel(
            name='Pirogue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.DecimalField(decimal_places=16, max_digits=22)),
                ('lon', models.DecimalField(decimal_places=16, max_digits=22)),
                ('number', models.CharField(max_length=10)),
                ('departure', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pirogues', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Immigrant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('date_of_birth', models.DateField()),
                ('is_male', models.BooleanField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='media/immigrants/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('birth_country', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='immigrants_birth_country', to='pirogue.country')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='immigrants', to=settings.AUTH_USER_MODEL)),
                ('nationality', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='immigrants_nationality_country', to='pirogue.country')),
                ('pirogue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='immigrants', to='pirogue.pirogue')),
            ],
        ),
    ]
