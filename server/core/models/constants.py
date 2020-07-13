from django.db import models


class RegStatusOptions(models.TextChoices):
    CLASS_PREFERENCES = ("CLASS_PREFERENCES",)
    FROZEN_PREFERENCES = ("FROZEN_PREFERENCES",)
    CHANGE_CLASSES = ("CHANGE_CLASSES",)
    PRE_PROGRAM = ("PRE_PROGRAM",)
    DAY_OF = ("DAY_OF",)
    POST_PROGRAM = ("POST_PROGRAM",)
