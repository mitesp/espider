import core.permissions as custom_permissions
from core.models import Program, StudentRegistration
from core.serializers import ProgramSerializer
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

# Dashboard API calls


class TeacherProgramViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows programs with open teacherreg to be viewed.
    Permissions: authenticated+teacher
    """

    permission_classes = (custom_permissions.IsTeacher,)
    # TODO(mvadari): let's move this to a get_active_programs() in a Program Manager
    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


@api_view(["GET"])
@permission_classes([custom_permissions.IsStudent])
def get_student_dashboard(request):
    user = request.user

    previous_programs = StudentRegistration.get_previous_programs(user)
    previous_json = [{"name": str(p), "url": p.url} for p in previous_programs]

    current_programs = StudentRegistration.get_current_programs(user)

    open_programs = Program.get_open_student_programs().exclude(id__in=current_programs)
    # TODO add grade checks

    current_json = [{"name": str(p), "url": p.url, "registered": False} for p in open_programs] + [
        {"name": str(p), "url": p.url, "registered": True} for p in current_programs
    ]
    current_json.sort(key=lambda p: p["name"])  # TODO edit to be better

    # TODO clean up API so we don't need weird conditionals in the UI

    return Response({"previous": previous_json, "current": current_json})
