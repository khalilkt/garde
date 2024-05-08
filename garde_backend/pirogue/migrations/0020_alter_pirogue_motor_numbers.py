# Generated by Django 5.0.4 on 2024-05-08 08:22

from django.db import migrations, models


def change_all(apps, schema_editor):
    Pirogue = apps.get_model('pirogue.Pirogue')
    for p in Pirogue.objects.all():
        numbers = p.motor_numbers
        map = {}
        for n in numbers:
            map[n] = None
        p.motor_numbers = map
        p.save()
        
class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0019_immigrant_free_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pirogue',
            name='motor_numbers',
            field=models.JSONField(blank=True, default=map),
        ),
        migrations.RunPython(change_all)
    ]