from core.models import Program
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def get_program_timeslots(request, program, edition):
    program = Program.objects.get(name=program, edition=edition)
    serialized_timeslots = [timeslot.date_time_str for timeslot in program.timeslots.all()]
    return Response(serialized_timeslots)
