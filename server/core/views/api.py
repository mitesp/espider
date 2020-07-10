import core.permissions as custom_permissions
from core.models import Class, Program, Section, StudentRegistration
from core.serializers import (
    ClassSerializer,
    ProgramSerializer,
    StudentRegSerializer,
    StudentSerializer,
    UserSerializer,
)
from django.db import transaction
from django.forms.models import model_to_dict
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


class StudentAccount(APIView):
    """
    Create a new student and return the access/refresh token pair.
    This is used during the signup process.
    Errors are not being handled yet.
    Permissions: any (don't have permissions before user is created)
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

    def post(self, request, format=None):
        serializer = StudentSerializer(data=request.data)
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

    permission_classes = (custom_permissions.IsTeacher,)
    # TODO(mvadari): let's move this to a get_active_programs() in a Program Manager
    queryset = Program.objects.all().filter(teacher_reg_open=True).order_by("edition", "name")
    serializer_class = ProgramSerializer


class ClassCatalog(APIView):
    """
    API endpoint that returns all classes.
    Permissions: authenticated
    # TODO have some publicly accessible version of this API
    """

    def get(self, request, program, edition, format=None):
        # TODO remove classes the student is registered in
        # TODO filter requests
        # TODO account for multi-block classes
        prog = Program.objects.get(name=program, edition=edition)
        classes = Class.objects.filter(program=prog)
        return Response([ClassSerializer(clazz).data for clazz in classes])


@api_view(["GET"])
@permission_classes([custom_permissions.IsStudent])
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


class StudentProgramClasses(APIView):
    """
    Get/update a student's class list for a given program.
    Permissions: logged in, is student, has studentreg object
    """

    def get(self, request, program, edition, format=None):
        # user = request.user

        # # TODO make this check better
        # prog = Program.objects.filter(name=program, edition=edition)[0]

        # studentreg = StudentRegistration.objects.get(student=user, program=prog)
        # classes = studentreg.get_classes()
        # timeslots = Timeslot.objects.filter(program=prog)

        ret = {
            "classes": [
                "How to beat your dad at chess, MIT style",
                "From Neurons to Thoughts: An Introduction to the Human Mind and Brain",
                None,
            ],
            "timeslots": ["Sat 10-11", "Sat 11-12", "Sat 12-1"],
        }

        return Response(ret)

    def post(self, request, program, edition, format=None):
        action = request.data["action"]
        # action can be determined from section info, but it seems unnecessary
        if action == "add":
            return self.add(request, program, edition)
        elif action == "remove":
            return self.remove(request, program, edition)
            # TODO implement this
        elif action == "add_waitlist":
            return self.add_waitlist(request, program, edition)
            # TODO implement this

    def add(self, request, program, edition):
        data = request.data
        user = request.user

        prog = Program.objects.get(name=program, edition=edition)
        studentreg = StudentRegistration.objects.get(student=user, program=prog)

        clazz = Class.objects.get(id=data["class"])
        section_num = data["section"]
        section = Section.objects.get(clazz=clazz, number=section_num)

        # check for space in the class
        if section.num_students == section.capacity:
            # TODO return an actual error
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        # TODO check for schedule compatibility

        # create StudentClassRegistration object
        studentreg.add_section(section)
        return self.get(request, program, edition)


# TODO figure out object permissions
