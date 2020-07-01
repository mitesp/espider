import csv

import os  # isort:skip

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")  # NOQA

# isort:imports-firstparty
import django  # pylint: disable=import-error # NOQA
from core.models import (  # NOQA
    Class,
    ESPUser,
    Program,
    StudentClassRegistration,
    StudentProfile,
    StudentRegistration,
    TeacherClassRegistration,
    TeacherProfile,
    TeacherRegistration,
)

django.setup()

DATA_DIR = "sample_data"
models_user = [ESPUser, StudentProfile, TeacherProfile]
models_program = [
    Program,
    Class,
    StudentRegistration,
    StudentClassRegistration,
    TeacherRegistration,
    TeacherClassRegistration,
]


# If fields are references to other model's primary keys, process that here
def process_data(model, data):
    print(data)
    for field, value in data.items():
        ref_model = model._meta.get_field(field).related_model
        if ref_model is not None:
            ref_obj = globals()[ref_model.__name__].objects.get(pk=value)
            data[field] = ref_obj
    return data


def create_instances(model):
    name = model.__name__
    filepath = DATA_DIR + "/" + name + ".tsv"
    if not os.path.exists(filepath):
        print("Please create and add data for file " + filepath)
        return []
    with open(filepath) as f:
        rows = csv.DictReader(f, delimiter="\t", quotechar='"')
        processed = [process_data(model, data) for data in rows]
        return [model(**data) for data in processed]


def insert_models_into_db(model):
    print("Inserting objects for " + model.__name__)
    instances = create_instances(model)
    model.objects.bulk_create(instances, ignore_conflicts=True)


[insert_models_into_db(model) for model in models_user]
[insert_models_into_db(model) for model in models_program]
