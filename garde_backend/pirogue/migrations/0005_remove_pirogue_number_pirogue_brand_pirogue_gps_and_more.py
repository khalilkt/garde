# Generated by Django 5.0.4 on 2024-04-24 08:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0004_alter_immigrant_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pirogue',
            name='number',
        ),
        migrations.AddField(
            model_name='pirogue',
            name='brand',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pirogue',
            name='gps',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='pirogue',
            name='material',
            field=models.CharField(blank=True, choices=[('wood', 'wood'), ('metal', 'metal'), ('plastic', 'plastic')], max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='pirogue',
            name='motor_numbers',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='pirogue',
            name='nationality',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='pirogues', to='pirogue.country'),
        ),
        migrations.AddField(
            model_name='pirogue',
            name='puissance',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
