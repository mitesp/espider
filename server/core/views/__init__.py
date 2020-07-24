from core.models import Program
from core.serializers import ClassSerializer, ProgramSerializer
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .accounts import *  # noqa
from .dashboard import *  # noqa
from .studentreg import *  # noqa

# TODO figure out object permissions for all API calls


@api_view(["GET"])
@permission_classes(
    [permissions.AllowAny,]
)
def get_all_programs(request):
    programs = Program.objects.all()
    return Response([ProgramSerializer(program).data for program in programs])


class ClassCatalog(APIView):
    """
    API endpoint that returns all classes.
    Permissions: authenticated
    # TODO have some publicly accessible version of this API
    """

    def get(self, request, program, season="", edition, format=None):
        classes = Program.objects.get(name=program, season=season, edition=edition).classes.all()
        return Response([ClassSerializer(clazz).data for clazz in classes])
