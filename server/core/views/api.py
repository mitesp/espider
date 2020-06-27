import core.permissions as custom_permissions
from core.models import Program, StudentRegistration
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


class StudentProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs with open studentreg to be viewed.
    Permissions: authenticated+student
    TODO add grade range checks
    """

    permission_classes = (custom_permissions.StudentPermission,)
    queryset = Program.objects.all().filter(student_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


class TeacherProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs with open teacherreg to be viewed.
    Permissions: authenticated+teacher
    """

    permission_classes = (custom_permissions.TeacherPermission,)
    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


class StudentPreviousProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs that a student has previously registered for
        to be viewed.
    Permissions: authenticated+student
    """

    permission_classes = (custom_permissions.StudentPermission,)
    serializer_class = ProgramSerializer

    def get_queryset(self):
        user = self.request.user
        studentregs = StudentRegistration.objects.filter(student=user).values_list(
            "program", flat=True
        )
        return Program.objects.filter(id__in=studentregs, student_reg_open=False)


@api_view("GET")
@permission_classes([custom_permissions.StudentPermission])  # TODO add grade range checks
def studentdashboard(request):
    pass


# TODO implement overall student dashboard call to be like:
# {
#   current: [
#     {name: HSSP, edition: 1957, registered: True},
#     {name: HSSP, edition: 1958, registered: False}
#   ],
#   previous: []
# }

# Reg Dashboard API calls


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
    studentreg = StudentRegistration.objects.get_or_create(program=prog, student=user)
    return Response(StudentRegSerializer(studentreg).data)
