# Generated by Django 5.0.4 on 2024-04-24 20:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0006_alter_pirogue_material'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='immigrant',
            name='last_name',
        ),
    ]
