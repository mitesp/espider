from core.models import Program, RegStatusOptions
from django.test import TestCase


class ProgramTests(TestCase):
    def setUp(self):
        Program.objects.create(name="Droplet", edition="3030", student_reg_open=True)
        Program.objects.create(
            name="Slosh", edition="420", student_reg_status=RegStatusOptions.POST_PROGRAM
        )

    def test_url(self):
        program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(program.url, "Droplet/3030")

    def test_open_student_programs(self):
        open_student_programs = Program.get_open_student_programs()
        expected_program = Program.objects.get(name="Droplet", edition="3030")
        self.assertListEqual(list(open_student_programs), [expected_program])

    def test_active_programs(self):
        active_programs = Program.get_active_programs()
        expected_program = Program.objects.get(name="Droplet", edition="3030")
        self.assertListEqual(list(active_programs), [expected_program])


class TimeslotTests(TestCase):
    pass
