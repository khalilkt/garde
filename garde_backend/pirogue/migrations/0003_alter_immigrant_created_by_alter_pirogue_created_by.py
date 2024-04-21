# Generated by Django 5.0.4 on 2024-04-20 23:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0002_rename_lon_pirogue_long'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='immigrant',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='immigrants', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='pirogue',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='pirogues', to=settings.AUTH_USER_MODEL),
        ),
    ]
