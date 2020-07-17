import os

import django_heroku

from .base import *  # noqa
from .base import DATABASES, DJANGO_ROOT, STATICFILES_DIRS, TEMPLATES

# The root directory of our codebase is one level above the django root directory
# This lets us access things inside client (e.g. templates, static files)
PROJECT_ROOT = os.path.dirname(DJANGO_ROOT)

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]

TEMPLATES["DIR"].append(os.path.join(PROJECT_ROOT, "client", "build"))

DATABASES["default"].update(
    {"USER": os.environ["POSTGRES_USER"], "PASSWORD": os.environ["POSTGRES_PASSWORD"],}
)

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

STATICFILES_DIRS.append(os.path.join(PROJECT_ROOT, "client", "build", "static"))

django_heroku.settings(locals())
