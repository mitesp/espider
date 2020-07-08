# Generated by Django 3.0.7 on 2020-07-08 21:11

from django.db import migrations, models
import django.db.models.expressions


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20200705_2044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentregistration',
            name='reg_status',
            field=models.CharField(choices=[('CLASS_PREFERENCES', 'Class Preferences'), ('FROZEN_PREFERENCES', 'Frozen Preferences'), ('CHANGE_CLASSES', 'Change Classes'), ('PRE_PROGRAM', 'Pre Program'), ('DAY_OF', 'Day Of'), ('POST_PROGRAM', 'Post Program')], max_length=20),
        ),
        migrations.AlterUniqueTogether(
            name='timeslot',
            unique_together={('start', 'end', 'program')},
        ),
        migrations.AddConstraint(
            model_name='section',
            constraint=models.CheckConstraint(check=models.Q(number__gt=0), name='number_nonzero'),
        ),
        migrations.AddConstraint(
            model_name='timeslot',
            constraint=models.CheckConstraint(check=models.Q(start__lt=django.db.models.expressions.F('end')), name='start_lt_end'),
        ),
    ]
