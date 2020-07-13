from core.models import Class, Program
from core.serializers import ClassSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from .accounts import *  # noqa
from .dashboard import *  # noqa
from .studentreg import *  # noqa

# TODO figure out object permissions for all API calls


class ClassCatalog(APIView):
    """
    API endpoint that returns all classes.
    Permissions: authenticated
    # TODO have some publicly accessible version of this API
    """

    def get(self, request, program, edition, format=None):
        classes = Program.objects.get(name=program, edition=edition).classes.all()
        return Response([ClassSerializer(clazz).data for clazz in classes])
