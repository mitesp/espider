from django.db import models

from .clazz import Class, Section
from .constants import RegStatusOptions
from .program import Program
from .users import ESPUser


# TODO: Validate that the fk users have correct type before creation
class StudentRegistration(models.Model):
    student = models.ForeignKey(
        ESPUser,
        on_delete=models.CASCADE,
        related_name="studentregs",
        related_query_name="studentreg",
    )
    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="studentregs",
        related_query_name="studentreg",
    )

    # student reg status
    reg_status = models.CharField(
        max_length=20,
        choices=RegStatusOptions.choices,
        default=RegStatusOptions.CLASS_PREFERENCES
        # TODO figure out if it's possible to make the default whatever the program value is
        # might be easier to do this by hand in whatever function is creating this studentreg
    )

    # TODO(mvadari): hmm "updated" might be a better than "check"? (e.g. profile_updated)
    # or maybe "completed"? Looks like these bubble up all the way to the frontend
    update_profile_check = models.BooleanField(default=False)
    emergency_info_check = models.BooleanField(default=False)
    liability_check = models.BooleanField(default=False)
    medliab_check = models.BooleanField(default=False)
    availability_check = models.BooleanField(default=False)
    payment_check = models.BooleanField(default=False)

    class Meta:
        unique_together = (("student", "program"),)

    @property
    def sections(self):
        sections = self.classregs.values_list("section", flat=True)
        return Section.objects.filter(pk__in=sections)
        # TODO figure out if this is possible without using Section

    def __str__(self):
        return str(self.student.username) + "/" + str(self.program)

    def get_schedule(self, include_empty_timeslots=False):
        schedule = {}
        if include_empty_timeslots:
            schedule = {timeslot: None for timeslot in self.program.timeslots.all()}
        for section in self.sections:
            for block in section.scheduled_blocks.all():
                timeslot = block.timeslot
                schedule[timeslot] = section
        # TODO add check to make sure sections don't overlap timeslots
        # (or just make sure that's not possible when adding)
        return sorted(list(schedule.items()), key=lambda pair: pair[0].start)

    @staticmethod
    def get_previous_programs(user):
        """
        Get programs for which a student has a studentreg object and the program is over
        """
        previous_program_ids = user.studentregs.filter(
            reg_status=RegStatusOptions.POST_PROGRAM
        ).values_list("program", flat=True)
        previous_programs = Program.objects.filter(
            id__in=previous_program_ids, student_reg_open=False
        )
        return previous_programs

    @staticmethod
    def get_current_programs(user):
        current_studentregs = user.studentregs.exclude(
            reg_status=RegStatusOptions.POST_PROGRAM
        ).values_list("program", flat=True)
        current_programs = Program.objects.filter(id__in=current_studentregs)
        return current_programs


class TeacherRegistration(models.Model):
    # TODO(mvadari): same naming comment about "check" as above
    teacher = models.ForeignKey(
        ESPUser,
        on_delete=models.CASCADE,
        related_name="teacherregs",
        related_query_name="teacherreg",
    )
    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        related_name="teacherregs",
        related_query_name="teacherreg",
    )
    update_profile_check = models.BooleanField(default=False)
    # TODO add shirt size

    class Meta:
        unique_together = (("teacher", "program"),)

    @property
    def classes(self):
        ids = self.classregs.values_list("clazz", flat=True)
        return Class.objects.filter(id__in=ids)

    def __str__(self):
        return str(self.teacher.username) + "/" + str(self.program)
