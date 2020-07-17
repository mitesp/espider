from .base import *  # noqa
from .base import DATABASES

DEBUG = True
SECRET_KEY = "#9)52e8#3kv$kwxkq#$zaz8cemk$!fo@s97frdgdr%ptj98436"

DATABASES["default"].update(
    {"USER": "edward", "PASSWORD": "lobster",}
)
