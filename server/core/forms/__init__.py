from core.models import Class, StudentClassRegistration
from django import forms
from django.db.models import Count

from .signup import *  # noqa


class StudentClassRegistrationForm(forms.Form):
    classes = forms.ModelMultipleChoiceField(
        queryset=Class.objects.none(),
        to_field_name="title",
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    def __init__(self, *args, **kwargs):
        studentreg = kwargs.pop("studentreg")  # throws an error if user is not present
        delete = kwargs.pop("delete")
        program = kwargs.pop("program")

        super(StudentClassRegistrationForm, self).__init__(*args, **kwargs)

        classes = StudentClassRegistration.objects.filter(student__exact=studentreg).values_list(
            "clazz", flat=True
        )
        enrolled_classes = Class.objects.filter(id__in=classes).filter(program__exact=program)
        non_enrolled_classes = (
            Class.objects.exclude(id__in=classes)
            .filter(program__exact=program)
            .exclude(capacity__lte=0)
        )

        # count the number of students in each class
        counts = (
            StudentClassRegistration.objects.all()
            .values("clazz")
            .annotate(num_students=Count("student"))
        )

        # remove full classes from the visible set

        # TODO improve this so it uses query stuff, idk how
        # can traverse the foreign key relationship backwards, might be useful
        # source: https://docs.djangoproject.com/en/3.0/topics/db/aggregation/ cheat sheet examples
        for c in counts:
            clazz = Class.objects.get(pk=c["clazz"])
            num_students = c["num_students"]
            if num_students >= clazz.capacity:
                non_enrolled_classes = non_enrolled_classes.exclude(pk=clazz.id)

        # if delete is true (aka this is the delete mode of the form)
        #   show the classes the student is enrolled in
        # else show the non-full classes the student is not enrolled in
        self.fields["classes"].queryset = enrolled_classes if delete else non_enrolled_classes
