from core.models import Class, ESPUser
from core.serializers import ClassSerializer, UserSerializer
from rest_framework import viewsets


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
