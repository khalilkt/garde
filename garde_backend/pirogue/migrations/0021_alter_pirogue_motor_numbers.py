# Generated by Django 5.0.4 on 2024-05-08 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0020_alter_pirogue_motor_numbers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pirogue',
            name='motor_numbers',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
