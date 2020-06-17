# Generated by Django 3.0.7 on 2020-06-17 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_remove_class_teacher'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='dob',
            field=models.DateField(blank=True, default='1969-12-31', max_length=8),
        ),
        migrations.AlterField(
            model_name='student',
            name='grad_year',
            field=models.IntegerField(blank=True, default=1970),
        ),
        migrations.AlterField(
            model_name='student',
            name='school',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
    ]