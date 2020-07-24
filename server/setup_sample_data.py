import csv

import os  # isort:skip # NOQA

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")  # isort:skip # NOQA

import django  # pylint: disable=import-error # isort:skip # NOQA

django.setup()  # isort:skip  # NOQA

# isort:imports-firstparty
from core.models import (  # NOQA
    Class,
    Classroom,
    ESPUser,
    Program,
    ScheduledBlock,
    Section,
    StudentClassRegistration,
    StudentProfile,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherProfile,
    TeacherRegistration,
    Timeslot,
)


DATA_DIR = "sample_data"
user_models = [ESPUser, StudentProfile, TeacherProfile]
program_models = [
    Program,
    Class,
    Timeslot,
    Classroom,
    Section,
    ScheduledBlock,
    StudentRegistration,
    StudentClassRegistration,
    TeacherRegistration,
    TeacherClassRegistration,
]


def resolve_ref_fields(model, data):
    # Resolve foreign keys to object instances for an instance of a model with
    # field-value pairs data. Mutates and returns resolved data.
    print(data)
    for field, value in data.items():
        ref_model = model._meta.get_field(field).related_model
        if ref_model is not None:
            ref_obj = ref_model.objects.get(pk=value)
            data[field] = ref_obj
        elif model == ESPUser and field == "password":
            # properly hash passwords
            data[field] = django.contrib.auth.hashers.make_password(value)
    return data


def create_instances(model):
    name = model.__name__
    filepath = DATA_DIR + "/" + name + ".tsv"
    if not os.path.exists(filepath):
        print("Please create and add data for file " + filepath)
        return []
    with open(filepath) as f:
        rows = csv.DictReader(f, delimiter="\t", quotechar='"')
        processed = [resolve_ref_fields(model, data) for data in rows]
        return [model(**data) for data in processed]


def insert_model_into_db(model):
    print("Inserting objects for " + model.__name__)
    instances = create_instances(model)
    model.objects.bulk_create(instances, ignore_conflicts=True)


[insert_model_into_db(model) for model in user_models]
[insert_model_into_db(model) for model in program_models]
