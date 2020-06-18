from core.models import ESPUser, Class
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ESPUser
        fields = ["username", "email", "is_student"]


class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Class
        fields = ["title", "description", "num_students", "capacity"]
