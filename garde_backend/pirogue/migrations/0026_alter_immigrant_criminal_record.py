# Generated by Django 5.0.4 on 2024-05-09 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0025_alter_immigrant_criminal_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='immigrant',
            name='criminal_record',
            field=models.CharField(choices=[('killer', 'killer'), ('danger', 'danger'), ('thief', 'thief')], max_length=100, null=True),
        ),
    ]
