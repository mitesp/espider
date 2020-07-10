import core.permissions as custom_permissions
from core.models import Class, Program, Section, StudentRegistration
from core.serializers import SectionSerializer, StudentRegSerializer
from django.db import transaction
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.views import APIView

# Registration API calls


class StudentRegAPI(APIView):
    """
    Determine the current studentreg object by the user and the program/edition
    Permissions: authenticated+student, student is in the correct grade range,
        program open for registration, program not in Pre-Program/after
    """

    permission_classes = (custom_permissions.IsStudent,)

    def get(self, request, program, edition, format=None):
        user = request.user

        prog = Program.objects.get(name=program, edition=edition)

        studentreg, _ = StudentRegistration.objects.get_or_create(student=user, program=prog)
        # TODO figure out how to change the default regstatus based on the program's status
        return Response(StudentRegSerializer(studentreg).data)


class StudentProgramClasses(APIView):
    """
    Get/update a student's class list for a given program.
    Permissions: logged in, is student, has studentreg object
    """

    permission_classes = (custom_permissions.IsStudent,)

    def get(self, request, program, edition, format=None, include_empty_timeslots=False):
        user = request.user
        params = request.GET

        prog = Program.objects.get(name=program, edition=edition)
        studentreg = StudentRegistration.objects.get(student=user, program=prog)
        include_empty_timeslots = (
            params.get("include_empty_timeslots", False) or include_empty_timeslots
        )
        schedule = studentreg.get_schedule(include_empty_timeslots=include_empty_timeslots)

        ret = [
            {
                "timeslot": timeslot.date_time_str,
                "section": (SectionSerializer(section).data if section else None),
            }
            for (timeslot, section) in schedule
        ]
        # TODO handle multi-timeblocks classes better
        # TODO consider refactoring to incorporate shardulc's comments in PR #22

        return Response(ret)

    def post(self, request, program, edition, format=None):
        action = request.data["action"]
        # action can be determined from section info, but it seems unnecessary
        if action == "add":
            return self.add(request, program, edition)
            # TODO implement this
        elif action == "remove":
            return self.remove(request, program, edition)
        elif action == "add_waitlist":
            return self.add_waitlist(request, program, edition)
            # TODO implement this

    def remove(self, request, program, edition):
        data = request.data
        user = request.user

        prog = Program.objects.get(name=program, edition=edition)
        studentreg = StudentRegistration.objects.get(student=user, program=prog)

        clazz = Class.objects.get(id=data["class"])
        section_num = data["section"]
        section = Section.objects.get(clazz=clazz, number=section_num)

        studentreg.remove_section(section)
        return self.get(request, program, edition, include_empty_timeslots=True)


class Profile(APIView):
    """
    Get/update user profile.
    Permissions: logged in, is_student
    """

    permission_classes = (custom_permissions.IsStudent,)

    def get(self, request, format=None):
        user = request.user
        profile = user.profile
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
        data.update(model_to_dict(profile))

        return Response(data)

    @transaction.atomic
    def post(self, request, format=None):
        """
        TODO: validate:
            ensure email is in email format
            ensure phone number is in phone number format
            ensure country is an actual country
            ideally, ensure state is in country (at least for US)
            check pronouns (unless there's an Other field)

        """
        user = request.user
        data = request.data

        self.update_profile(user, data)
        self.update_profile_check(user, data)

        return Response({"message": "Success!"})

    def update_profile(self, user, data):
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.email = data.get("email")
        user.save()

        if user.is_student:
            profile = user.profile
            profile.phone_number = data.get("phone_number")
            profile.pronouns = data.get("pronouns")
            profile.city = data.get("city")
            profile.state = data.get("state")
            profile.country = data.get("country")
            profile.school = data.get("school")
            profile.save()

    def update_profile_check(self, user, data):
        if "update_profile" in data and data["update_profile"]:
            program = Program.objects.get(name=data.get("program"), edition=data.get("edition"))
            studentreg = StudentRegistration.objects.get(student=user, program=program)
            studentreg.update_profile_check = True
            studentreg.save()


class EmergencyInfo(APIView):
    """
    Check off emergency info.
    Will get/update emergency info in the future.
    Permissions: logged in, is_student, has studentreg object
    """

    permission_classes = (custom_permissions.IsStudent,)

    def get(self, request, program, edition, format=None):
        # user = request.user
        # params = request.GET

        # program = Program.objects.get(name=params["program"], edition=params["edition"])
        # studentreg = StudentRegistration.objects.get(student=user, program=program)

        # return current emergency info
        # maybe populate this with parent info (or have that be an option)

        return Response({})

    def post(self, request, program, edition, format=None):
        studentreg = self.get_object(program, edition)
        # submit emergency info

        studentreg.emergency_info_check = True
        studentreg.save()

        # TODO add correction checks
        return Response({"message": "Success!"})

    def get_object(self, program, edition):
        user = self.request.user
        program = Program.objects.get(name=program, edition=edition)
        # TODO add check for if studentreg object exists
        studentreg = StudentRegistration.objects.get(student=user, program=program)

        return studentreg


class MedicalLiability(APIView):
    """
    Check off medical liability waiver.
    This will likely be a part of the hook that Formstack uses.
    Permissions: logged in, is_student, has studentreg object
    """

    permission_classes = (custom_permissions.IsStudent, custom_permissions.NoMedliabCheck)

    def post(self, request, program, edition, format=None):
        studentreg = self.get_object(program, edition)

        # TODO maybe add other permissions to this so you can't accidentally do this?
        # Like something from formstack

        studentreg.medliab_check = True
        studentreg.save()

        # TODO add correction checks
        return Response({"message": "Success!"})

    def get_object(self, program, edition):
        user = self.request.user
        program = Program.objects.get(name=program, edition=edition)
        # TODO add check for if studentreg object exists
        studentreg = StudentRegistration.objects.get(student=user, program=program)

        return studentreg


class LiabilityWaiver(APIView):
    """
    Check off liability waiver.
    This will likely be part of the hook that the waiver website uses.
    Permissions: logged in, is_student, has studentreg object
    """

    permission_classes = (custom_permissions.IsStudent, custom_permissions.NoLiabilityCheck)

    def post(self, request, program, edition, format=None):
        studentreg = self.get_object(program, edition)

        # TODO maybe add other permissions to this so you can't accidentally do this?

        studentreg.liability_check = True
        studentreg.save()

        # TODO add correction checks
        return Response({"message": "Success!"})

    def get_object(self, program, edition):
        user = self.request.user
        program = Program.objects.get(name=program, edition=edition)
        # TODO add check for if studentreg object exists
        studentreg = StudentRegistration.objects.get(student=user, program=program)

        return studentreg


class Availability(APIView):
    """
    Check off availability form.
    Will get/update availability info in the future.
    Permissions: logged in, is_student, has studentreg object
    """

    permission_classes = (custom_permissions.IsStudent,)

    # TODO incorporate teacher stuff here too

    def post(self, request, program, edition, format=None):
        studentreg = self.get_object(program, edition)

        studentreg.availability_check = True
        studentreg.save()

        # TODO add correction checks
        return Response({"message": "Success!"})

    def get_object(self, program, edition):
        user = self.request.user
        program = Program.objects.get(name=program, edition=edition)
        # TODO add check for if studentreg object exists
        studentreg = StudentRegistration.objects.get(student=user, program=program)

        return studentreg
