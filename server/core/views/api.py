import core.permissions as custom_permissions
from core.models import Program, StudentRegistration, TeacherRegistration
from core.serializers import (
    ProgramSerializer,
    StudentRegSerializer,
    UserSerializer,
    UserSerializerWithToken,
)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

# Login API calls


@api_view(["GET"])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    Permissions: authenticated (automatic)
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CreateUser(APIView):
    """
    Create a new user.
    Permissions: any (don't have permissions before user is created)
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Dashboard API calls


class TeacherProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs with open teacherreg to be viewed.
    Permissions: authenticated+teacher
    """

    permission_classes = (custom_permissions.TeacherPermission,)
    # TODO(mvadari): let's move this to a get_active_programs() in a Program Manager
    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


@api_view(["GET"])
@permission_classes([custom_permissions.StudentPermission])
def get_student_dashboard(request):
    user = request.user

    previous_programs = Program.get_previous_student_programs(user)
    previous_json = [{"name": str(p), "url": p.url} for p in previous_programs]

    current_programs = Program.get_current_student_programs(user)

    open_programs = Program.get_open_student_programs().exclude(id__in=current_programs)
    # TODO add grade checks

    current_json = [{"name": str(p), "url": p.url, "registered": False} for p in open_programs] + [
        {"name": str(p), "url": p.url, "registered": True} for p in current_programs
    ]
    current_json.sort(key=lambda p: p["name"])  # TODO edit to be better

    # TODO clean up API so we don't need weird conditionals in the UI

    return Response({"previous": previous_json, "current": current_json})

# Registration API calls


@api_view(["GET"])
@permission_classes([custom_permissions.StudentPermission])
def current_studentreg(request):
    """
    Determine the current studentreg object by the user and the program/edition
    Permissions: authenticated+student, student is in the correct grade range,
        program open for registration, program not in Pre-Program/after
    """

    program = request.GET["program"]
    edition = request.GET["edition"]
    prog = Program.objects.filter(name__iexact=program, edition__iexact=edition)[0]
    user = request.user
    studentreg, _ = StudentRegistration.objects.get_or_create(student=user, program=prog)
    # TODO figure out how to change the default regstatus based on the program's status
    return Response(StudentRegSerializer(studentreg).data)


class Profile(APIView):
    """
    Create a new user.
    Permissions: any (don't have permissions before user is created)
    """

    permission_classes = (custom_permissions.StudentOrTeacherPermission,)

    def get(self, request, format=None):
        user = request.user
        profile = user.profile
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": profile.phone_number,
            "pronouns": profile.pronouns,
            "city": profile.city,
            "state": profile.state,
            "country": profile.country,
        }
        if user.is_student:
            profile = user.student_profile
            data["date_of_birth"] = profile.date_of_birth
            data["grad_year"] = profile.grad_year
            data["school"] = profile.school

        if user.is_teacher:
            profile = user.teacher_profile
            data["affiliation"] = profile.affiliation

        return Response(data)

    def post(self, request, format=None):
        user = request.user
        data = request.data

        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.email = data["email"]
        user.save()

        if user.is_student:
            self.update_student(user, data)

        if user.is_teacher:
            self.update_teacher(user, data)

        # TODO add correction checks
        return Response({"message": "Success!"})

    def update_student(self, user, data):
        profile = user.student_profile
        profile.phone_number = data["phone_number"]
        profile.pronouns = data["pronouns"]
        profile.city = data["city"]
        profile.state = data["state"]
        profile.country = data["country"]
        profile.date_of_birth = data["date_of_birth"]
        profile.grad_year = data["grad_year"]
        profile.school = data["school"]
        profile.save()

        if "update_profile" in data and data["update_profile"]:
            assert "program" in data
            assert "edition" in data

            program = Program.objects.get(name=data["program"], edition=data["edition"])
            studentreg = StudentRegistration.objects.get(student=user, program=program)
            studentreg.update_profile_check = True
            studentreg.save()

    def update_teacher(self, user, data):
        profile = user.teacher_profile
        profile.phone_number = data["phone_number"]
        profile.pronouns = data["pronouns"]
        profile.city = data["city"]
        profile.state = data["state"]
        profile.affiliation = data["affiliation"]
        profile.save()

        if "update_profile" in data and data["update_profile"]:
            assert "program" in data
            assert "edition" in data
            program = Program.objects.get(name=data["program"], edition=data["edition"])
            teacherreg = TeacherRegistration.objects.get(teacher=user, program=program)
            teacherreg.update_profile_check = True
            teacherreg.save()


class EmergencyInfo(APIView):
    """
    Create a new user.
    Permissions: any (don't have permissions before user is created)
    """

    permission_classes = (custom_permissions.StudentPermission,)

    def get(self, request, format=None):
        # user = request.user
        # params = request.GET

        # program = Program.objects.get(name=params["program"], edition=params["edition"])
        # studentreg = StudentRegistration.objects.get(student=user, program=program)

        # return current emergency info
        # maybe populate this with parent info (or have that be an option)

        return Response({})

    def post(self, request, format=None):
        user = request.user
        data = request.data

        program = Program.objects.get(name=data["program"], edition=data["edition"])
        studentreg = StudentRegistration.objects.get(student=user, program=program)

        # submit emergency info

        studentreg.emergency_info_check = True
        studentreg.save()

        # TODO add correction checks
        return Response({"message": "Success!"})
