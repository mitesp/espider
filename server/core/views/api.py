from core.models import Class, Program
from core.serializers import (
    ClassSerializer,
    ProgramSerializer,
    UserSerializer,
    UserSerializerWithToken,
)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


@api_view(["GET"])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CreateUser(APIView):
    """
    Create a new user.
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClassViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows classes to be viewed or edited.
    """

    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows programs to be viewed or edited.
    """

    queryset = Program.objects.all().order_by("edition", "name")
    serializer_class = ProgramSerializer
