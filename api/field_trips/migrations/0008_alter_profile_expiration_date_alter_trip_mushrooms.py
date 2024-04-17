# Generated by Django 5.0.4 on 2024-04-17 22:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('field_trips', '0007_trip_leader_trip_registration_close_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='expiration_date',
            field=models.DateField(default=datetime.datetime(2025, 4, 17, 22, 32, 7, 418336, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='trip',
            name='mushrooms',
            field=models.ManyToManyField(blank=True, to='field_trips.mushroom'),
        ),
    ]
