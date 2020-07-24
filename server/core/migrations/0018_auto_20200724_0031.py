# Generated by Django 3.0.7 on 2020-07-24 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_auto_20200713_1925'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='season',
            field=models.SlugField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='program',
            name='edition',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='program',
            name='name',
            field=models.SlugField(max_length=200),
        ),
    ]
