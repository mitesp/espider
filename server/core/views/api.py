from rest_framework import viewsets

from ..models import Class, ESPUser
from ..serializers import ClassSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = ESPUser.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


class ClassViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Class.objects.all()
    serializer_class = ClassSerializer
