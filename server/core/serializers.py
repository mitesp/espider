from core.models import (
    Class,
    ESPUser,
    Program,
    ScheduledBlock,
    Section,
    StudentProfile,
    StudentRegistration,
    Timeslot,
)
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ESPUser
        fields = ("username", "is_student", "is_teacher")


# TODO: The following two serializers are used for account creation and eventually should be fleshed
# out to include other fields as well as validation / legitimate error handling
class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["phone_number", "school"]


class StudentSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer()
    tokens = serializers.SerializerMethodField()

    class Meta:
        model = ESPUser
        fields = ("tokens", "username", "password", "profile")
        extra_kwargs = {"password": {"write_only": True}}

    def get_tokens(self, user):
        tokens = RefreshToken.for_user(user)
        refresh = str(tokens)
        access = str(tokens.access_token)
        data = {"refresh": refresh, "access": access}
        return data

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        user = ESPUser.objects.create_user(**validated_data)
        StudentProfile.objects.create(**profile_data, user=user)
        return user


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


class TimeslotSerializer(serializers.ModelSerializer):
    string = serializers.SerializerMethodField()

    class Meta:
        model = Timeslot
        fields = ("id", "string")

    def get_string(self, timeslot):
        return timeslot.date_time_str


class ScheduledBlockSerializer(serializers.ModelSerializer):
    timeslot = TimeslotSerializer()
    classroom = serializers.SerializerMethodField()
    string = serializers.SerializerMethodField()

    class Meta:
        model = ScheduledBlock
        fields = ("section", "timeslot", "classroom", "string")

    def get_classroom(self, scheduled_block):
        return scheduled_block.classroom.name

    def get_string(self, scheduled_block):
        return str(scheduled_block)


class SectionSerializer(serializers.ModelSerializer):
    scheduled_blocks = ScheduledBlockSerializer(many=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = (
            "id",
            "clazz",
            "length",
            "name",
            "number",
            "num_students",
            "scheduled_blocks",
        )

    def get_name(self, section):
        return str(section)


class ClassSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True)
    # TODO figure out how to make this ordered

    class Meta:
        model = Class
        fields = ("id", "title", "description", "teachers", "capacity", "sections")
