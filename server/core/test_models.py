from core.models import Program, RegStatusOptions
from django.test import TestCase


class ProgramTests(TestCase):
    def setUp(self):
        Program.objects.create(name="Droplet", edition="3030")
        Program.objects.create(name="Slosh", edition="420")

    def test_program_does_not_exist(self):
        with self.assertRaises(Program.DoesNotExist):
            Program.objects.get(name="NotProgram")

    def test_program_exists(self):
        try:
            Program.objects.get(name="Droplet", edition="3030")
        except Program.DoesNotExist:
            self.fail("Program does not exist unexpectedly!")

    def test_default_student_reg_status(self):
        program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(program.student_reg_status, RegStatusOptions.CLASS_PREFERENCES)

    def test_url(self):
        program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(program.url, "Droplet/3030")
