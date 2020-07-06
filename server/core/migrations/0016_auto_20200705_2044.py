# Generated by Django 3.0.7 on 2020-07-05 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_auto_20200705_2012'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentclassregistration',
            name='section',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='core.Section'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='scheduledblock',
            unique_together={('section', 'timeslot')},
        ),
        migrations.AlterUniqueTogether(
            name='studentclassregistration',
            unique_together={('studentreg', 'section')},
        ),
        migrations.RemoveField(
            model_name='studentclassregistration',
            name='clazz',
        ),
    ]
