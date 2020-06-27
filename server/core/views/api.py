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


class TeacherProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs with open teacherreg to be viewed.
    Permissions: authenticated+teacher
    """

    permission_classes = (custom_permissions.TeacherPermission,)
    # TODO(mvadari): let's move this to a get_active_programs() in a Program Manager
    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


# TODO(mvadari): this function name should be snake-typed
@api_view(["GET"])
@permission_classes([custom_permissions.StudentPermission])
def getstudentdashboard(request):
    user = request.user

    # TODO(mvadari): this should all probably get moved into a class method in some model
    # TODO(mvadari): the status checks should use the choices object you defined (instead of
    # strings)
    studentregs = StudentRegistration.objects.filter(student=user)

    previous_program_ids = studentregs.filter(reg_status="POST").values_list("program", flat=True)
    previous_programs = Program.objects.filter(id__in=previous_program_ids, student_reg_open=False)
    previous_json = [{"name": p.name, "edition": p.edition} for p in previous_programs]

    open_programs = Program.objects.all().filter(student_reg_open=True)
    # TODO add grade checks

    current_studentregs = studentregs.exclude(reg_status="POST")
    current_programs = Program.objects.filter(id__in=current_studentregs, student_reg_open=False)
    current_json = [
        {"name": p.name, "edition": p.edition, "registered": False} for p in open_programs
    ] + [{"name": p.name, "edition": p.edition, "registered": True} for p in current_programs]
    current_json.sort(key=lambda p: (p["name"] + " " + p["edition"]))  # TODO edit to be better

    return Response({"previous": previous_json, "current": current_json})


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
    studentreg, _ = StudentRegistration.objects.get_or_create(student=user, program=prog)
    # TODO figure out how to change the default regstatus based on the program's status
    return Response(StudentRegSerializer(studentreg).data)
