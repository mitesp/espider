from django.db import models

from .constants import RegStatusOptions

# TODO move static methods to managers


class Program(models.Model):
    name = models.CharField(max_length=200)  # TODO maybe this should be a constant set
    edition = models.CharField(max_length=200)  # this is (season +) year
    student_reg_open = models.BooleanField(default=False)
    student_reg_status = models.CharField(
        max_length=20, choices=RegStatusOptions.choices, default=RegStatusOptions.CLASS_PREFERENCES
    )
    teacher_reg_open = models.BooleanField(default=False)
    # TODO add timeslots?

    @property
    def url(self):
        return self.name + "/" + self.edition  # TODO handle multi-word editions/seasons

    def __str__(self):
        return self.name + " " + self.edition

    @staticmethod
    def get_open_student_programs():
        return Program.objects.filter(student_reg_open=True)

    @staticmethod
    def get_active_programs():
        # TODO figure out what actually defines an "active" program
        return Program.objects.exclude(student_reg_status=RegStatusOptions.POST_PROGRAM)

    @staticmethod
    def get_inactive_programs():
        # TODO figure out what actually defines an "active" program
        return Program.objects.filter(student_reg_status=RegStatusOptions.POST_PROGRAM)


class Timeslot(models.Model):
    """
    A Timeslot is a date x duration block during which a program is happening.
    The duration should be the smallest denomination of time that schedule
    offsets need to be able to accommodate.

    TODO(constraint): Timeslot durations should be constant for a given program.
    TODO(constraint): start < end
    TODO(constraint): start.time and end.time could only be a fixed set of
    values (potentially on the hour and half hour, maybe quarter hour)
    TODO(constraint): start and end on the same day, except for edge cases like
    midnight (e.g. Firehose) (makes printing nicer as well)

    Examples:
    A Splash where all classes are multiples of an hour may have 19 timeslots
        2019/11/16 10:00–11:00, 11:00–12:00, and so on (for a total of 10)
        2019/11/17 09:00–10:00, 10:00–11:00, and so on (for a total of 9)

    An HSSP with 1-hour and 1.5-hour classes may have 42 timeslots
    (6 timeslots/day x 7 days/program)
        2020/02/29 13:00–13:30, 13:30–14:00, ... , 15:30–16:00 (total of 6)
        and repeated for 2020/03/07, and so on (for 7 Saturdays)
    """

    # TODO: come up with a way to disambiguate between slot times, class times,
    # and effective class times (with transition)
    start = models.DateTimeField()
    end = models.DateTimeField()
    program = models.ForeignKey(
        Program, on_delete=models.CASCADE, related_name="timeslots", related_query_name="timeslot"
    )

    @property
    def date_time_str(self):
        date_format = "%a"  # day of week
        time_format = "%-I:%M %p"  # 12hr HH:MM am/pm
        return (
            self.start.strftime(date_format)
            + " "
            + self.start.strftime(time_format)
            + "-"
            + self.end.strftime(time_format)
        )

    def __str__(self):
        time_format = "%-I:%M %p"  # 12hr HH:MM am/pm
        date_format = "%-m/%d/%y"  # mm/dd/yyyy
        return (
            self.start.strftime(date_format)
            + ", "
            + self.start.strftime(time_format)
            + " to "
            + self.end.strftime(time_format)
        )
