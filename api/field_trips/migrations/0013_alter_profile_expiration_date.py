# Generated by Django 5.0.4 on 2024-04-19 16:03

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('field_trips', '0012_alter_profile_expiration_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='expiration_date',
            field=models.DateField(default=datetime.datetime(2025, 4, 19, 16, 3, 57, 296609, tzinfo=datetime.timezone.utc)),
        ),
    ]
