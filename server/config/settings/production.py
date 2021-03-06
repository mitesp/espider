import os

import django_heroku

from .base import *  # noqa
from .base import BASE_DIR, DATABASES, STATICFILES_DIRS, TEMPLATES

# The root directory of our codebase is one level above the django root directory
# This lets us access things inside client (e.g. templates, static files)
PROJECT_ROOT = os.path.dirname(BASE_DIR)

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]

TEMPLATES[0]["DIRS"].append(os.path.join(PROJECT_ROOT, "client", "build"))

# TODO: this probably should pull from env vars
DATABASES["default"].update(
    {"USER": "postgres", "PASSWORD": "postgres",}
)

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

STATICFILES_DIRS.append(os.path.join(PROJECT_ROOT, "client", "build", "static"))

django_heroku.settings(locals())
