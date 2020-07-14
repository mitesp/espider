from core.models import Class, Program
from core.serializers import ClassSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

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
        
        if "search" in params:
            query = params["search"]
            classes = classes.filter(Q(title__icontains=query) | Q(description__icontains=query))
            # TODO consider putting this in a well-named manager query
            # TODO investigate speed of query, consider postgres.search

        return Response([ClassSerializer(clazz).data for clazz in classes])
