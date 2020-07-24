import core.permissions as custom_permissions
from core.models import Program, StudentRegistration
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

# Dashboard API calls


@api_view(["GET"])
@permission_classes([custom_permissions.IsTeacher])
def get_teacher_dashboard(request):
    # TODO redo this function when we have a better understanding of teacher registration
    user = request.user

    previous_program_ids = user.teacherregs.all().values_list("program", flat=True)
    previous_programs = Program.objects.filter(id__in=previous_program_ids)
    previous_json = [{"name": str(p), "url": p.url} for p in previous_programs]

    open_programs = Program.get_open_teacher_programs()
    # TODO add grade checks

    current_json = [
        {"name": str(p), "url": p.url, "registered": p.teacherregs.filter(teacher=user).exists()}
        for p in open_programs
    ]
    current_json.sort(key=lambda p: p["name"])  # TODO edit to be better

    return Response({"previous": previous_json, "current": current_json})


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

    return Response({"previous": previous_json, "current": current_json})
