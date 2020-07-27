from core.models import Program, Section
from core.serializers import SectionSerializer, TimeslotSerializer
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def get_program_timeslots(request, program, edition):
    program = Program.objects.get(name=program, edition=edition)
    serialized_timeslots = [
        TimeslotSerializer(timeslot).data for timeslot in program.timeslots.all()
    ]
    return Response(serialized_timeslots)


@api_view(["GET"])
def get_program_classrooms(request, program, edition):
    program = Program.objects.get(name=program, edition=edition)
    classrooms = [classroom.name for classroom in program.classrooms.all()]
    return Response(classrooms)


@api_view(["GET"])
def get_program_sections(request, program, edition):
    program = Program.objects.get(name=program, edition=edition)
    sections = Section.objects.filter(clazz__program=program).order_by("clazz__id")
    serialized_sections = [SectionSerializer(section).data for section in sections]
    return Response(serialized_sections)


@api_view(["POST"])
@transaction.atomic
def schedule_section(request, program, edition, section_id):
    data = request.data

    program = Program.objects.get(name=program, edition=edition)
    section = Section.objects.get(id=section_id)
    if section.program != program:
        pass  # TODO return error or something here

    section.schedule(data["scheduled_blocks"])

    return Response({"message": "Success!"})


@api_view(["POST"])
def unschedule_section(request, program, edition, section_id):
    program = Program.objects.get(name=program, edition=edition)
    section = Section.objects.get(id=section_id)
    if section.program != program:
        pass  # TODO return error or something here

    section.unschedule()

    return Response({"message": "Success!"})
