from core.models import Program
from django.test import TestCase


class ProgramTests(TestCase):
    def setUp(self):
        Program.objects.create(name="Droplet", edition="3030")
        Program.objects.create(name="Slosh", edition="420")

    def test_url(self):
        program = Program.objects.get(name="Droplet", edition="3030")
        self.assertEquals(program.url, "Droplet/3030")
