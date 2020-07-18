from core.models import Program, RegStatusOptions
from django.test import TestCase


class ProgramTests(TestCase):
    def setUp(self):
        Program.objects.create(name="Droplet", edition="3030")
        Program.objects.create(name="Slosh", edition="420")

        # open student registration for one object
        program = Program.objects.get(name="Droplet", edition="3030")
        program.student_reg_open = True
        program.save()

        # make one program a past program
        program = Program.objects.get(name="Slosh", edition="420")
        program.student_reg_status = RegStatusOptions.POST_PROGRAM
        program.save()

    def test_url(self):
        program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(program.url, "Droplet/3030")

    def test_open_student_programs(self):
        open_student_programs = Program.get_open_student_programs()
        self.assertEquals(len(open_student_programs), 1)

        open_student_program = open_student_programs[0]
        expected_program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(open_student_program, expected_program)

    def test_active_programs(self):
        active_programs = Program.get_active_programs()
        self.assertEquals(len(active_programs), 1)

        active_program = active_programs[0]
        expected_program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(active_program, expected_program)


class TimeslotTests(TestCase):
    pass
