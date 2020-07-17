from django.db import models

from .program import Program, Timeslot
from .users import ESPUser


class Class(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    capacity = models.PositiveIntegerField()
    program = models.ForeignKey(
        Program, on_delete=models.CASCADE, related_name="classes", related_query_name="class"
    )

    class Meta:
        verbose_name_plural = "classes"

    @property
    def teachers(self):
        teacher_ids = self.teacherclassregs.values_list("teacherreg__teacher", flat=True)
        return ESPUser.objects.filter(id__in=teacher_ids).values_list("username", flat=True)
        # TODO clean this type of query up with select_related

    def __str__(self):
        return self.title


class Section(models.Model):
    clazz = models.ForeignKey(
        Class, on_delete=models.CASCADE, related_name="sections", related_query_name="section"
    )
    number = models.PositiveIntegerField()
    # TODO(constraint): PositiveIntegerField can be 0 due to django backwards
    # compatibility, but we should constrain it

    class Meta:
        unique_together = (("clazz", "number"),)

    @property
    def program(self):
        return self.clazz.program

    @property
    def num_students(self):
        return self.studentclassregs.count()

    def __str__(self):
        return str(self.clazz) + " sec. " + str(self.number)


class ScheduledBlock(models.Model):
    """
    A ScheduledBlock represents a section of a class scheduled at a timeslot of
    a program TODO: in a particular classroom.

    A 2-hour section scheduled in a program with 1-hour timeslot durations would
    be represented by two ScheduledBlock objects. A 1.5-hour section scheduled
    in a program with half-hour timeslot durations would be represented by three
    ScheduledBlock objects.

    TODO(constraint): section.program == timeslot.program
    """

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="scheduled_blocks",
        related_query_name="scheduled_block",
    )
    timeslot = models.ForeignKey(
        Timeslot,
        on_delete=models.CASCADE,
        related_name="scheduled_blocks",
        related_query_name="scheduled_block",
    )

    class Meta:
        unique_together = (("section", "timeslot"),)

    @property
    def program(self):
        return self.timeslot.program

    def __str__(self):
        return str(self.section) + " during " + str(self.timeslot)
