from core.models import Class, ESPUser, Program, StudentProfile, StudentRegistration
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESPUser
        fields = ("username", "is_student", "is_teacher")


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile

    fields = ["phone_number", "school"]


class StudentSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = ESPUser
        fields = ("tokens", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {"refresh": refresh, "access": access}
        return data

    def create(self, validated_data):
        user = ESPUser.objects.create_user(**validated_data)
        profile_data = validated_data.pop("profile")
        StudentProfile.create(**profile_data)
        return user

    def update(self, validated_data):
        pass


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ("name", "edition")


class StudentRegSerializer(serializers.ModelSerializer):
    # student_reg_open = serializers.CharField(source='program.student_reg_open')
    # commented code left in because it might be useful later, especially for access
    #   checks (whether they're allowed to access certain pages)

    class Meta:
        model = StudentRegistration
        fields = "__all__"  # ("student_reg_open",)


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = "title"
