# Generated by Django 3.0.7 on 2020-06-27 01:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20200626_0809'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentregistration',
            name='payment_check',
            field=models.BooleanField(default=False),
        ),
    ]
