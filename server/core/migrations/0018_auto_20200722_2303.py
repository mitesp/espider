# Generated by Django 3.0.7 on 2020-07-22 23:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_auto_20200713_1925'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='studentprofile',
            name='date_of_birth',
        ),
        migrations.RemoveField(
            model_name='studentprofile',
            name='grad_year',
        ),
    ]