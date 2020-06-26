import core.permissions as custom_permissions
from core.models import Class, Program, StudentRegistration
from core.serializers import (
    ClassSerializer,
    ProgramSerializer,
    StudentRegSerializer,
    UserSerializer,
    UserSerializerWithToken,
)
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
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


class ClassViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows classes to be viewed or edited.
    """

    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class StudentProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs to be viewed or edited.
    """

    queryset = Program.objects.all().filter(student_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


class TeacherProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs to be viewed or edited.
    """

    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


class StudentPreviousProgramViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (custom_permissions.StudentPermission,)
    serializer_class = ProgramSerializer

    def get_queryset(self):
        user = self.request.user
        studentregs = StudentRegistration.objects.filter(student=user).values_list(
            "program", flat=True
        )
        return Program.objects.filter(id__in=studentregs, student_reg_open=False)


@api_view(["GET"])
@permission_classes([custom_permissions.StudentPermission])
def current_studentreg(request):
    """
    Determine the current user by their token, and return their data
    """

    program = request.GET["program"]
    edition = request.GET["edition"]
    prog = Program.objects.filter(name__iexact=program, edition__iexact=edition)[0]
    user = request.user
    # print(request.data)
    studentreg = StudentRegistration.objects.get(program=prog, student=user)
    return Response(StudentRegSerializer(studentreg).data)
