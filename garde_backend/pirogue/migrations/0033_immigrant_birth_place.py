# Generated by Django 5.0.4 on 2024-06-05 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0032_immigrant_sejour'),
    ]

    operations = [
        migrations.AddField(
            model_name='immigrant',
            name='birth_place',
            field=models.CharField(default='', max_length=100),
        ),
    ]