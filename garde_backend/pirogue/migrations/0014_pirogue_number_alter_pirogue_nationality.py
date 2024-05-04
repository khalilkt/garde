# Generated by Django 5.0.4 on 2024-04-27 21:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0013_alter_pirogue_lat_alter_pirogue_long'),
    ]

    operations = [
        migrations.AddField(
            model_name='pirogue',
            name='number',
            field=models.CharField(default='0000', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pirogue',
            name='nationality',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='pirogues', to='pirogue.country'),
            preserve_default=False,
        ),
    ]