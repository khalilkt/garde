# Generated by Django 5.0.4 on 2024-05-04 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pirogue', '0015_alter_immigrant_birth_country_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pirogue',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='pirogues/'),
        ),
    ]