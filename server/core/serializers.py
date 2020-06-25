from core.models import Class, ESPUser, Program
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESPUser
        fields = ("username", "is_student", "is_teacher")


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ("name", "edition")


class UserSerializerWithToken(serializers.ModelSerializer):

    tokens = serializers.SerializerMethodField()

    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {"refresh": refresh, "access": access}
        return data

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = ESPUser
        fields = ("tokens", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}


class ESPUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ESPUser
        fields = ["username", "email", "is_student"]


class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Class
        fields = ["title", "description", "num_students", "capacity"]
