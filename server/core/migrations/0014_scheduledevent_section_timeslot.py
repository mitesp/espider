# Generated by Django 3.0.7 on 2020-07-03 06:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_program_student_reg_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Timeslot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Program')),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField()),
                ('clazz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Class')),
            ],
        ),
        migrations.CreateModel(
            name='ScheduledEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Section')),
                ('timeslot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Timeslot')),
            ],
        ),
    ]
