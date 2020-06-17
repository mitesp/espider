from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction
from django.db.models import Count, F, Subquery

from .models import Student, Teacher, ESPUser, Class, StudentClassRegistration


class ESPSignUpForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = ESPUser
        fields = ("username", "email", "password1", "password2", "first_name", "last_name","phone_number", "pronouns", "city", "state", "country")

    @transaction.atomic
    def save(self, commit=False):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user

class StudentSignUpForm(ESPSignUpForm):
    dob = forms.DateField(label="Date of Birth", required=False)
    grad_year = forms.IntegerField(label="Graduation Year", required=False)
    school = forms.CharField(max_length=200, required=False)

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_student = True
        user.save()
        student = Student.objects.create(user=user,
            dob=self.cleaned_data.get('dob'),
            grad_year=self.cleaned_data.get('grad_year'),
            school=self.cleaned_data.get('school'))
        return user


class TeacherSignUpForm(ESPSignUpForm):
    affiliation = forms.CharField(max_length=20, required=False)

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_teacher = True
        user.save()
        teacher = Teacher.objects.create(user=user, affiliation=self.cleaned_data.get('affiliation'))
        return user

class OtherAccountSignUpForm(ESPSignUpForm):
    
    @transaction.atomic
    def save(self):
        return super().save(commit=True)


class StudentClassRegistrationForm(forms.Form):
    classes = forms.ModelMultipleChoiceField(
        queryset=Class.objects.none(),
        to_field_name="title",
        widget=forms.CheckboxSelectMultiple,
        required=False)

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user') # throws an error if user is not present
        delete = kwargs.pop('delete')

        super(StudentClassRegistrationForm, self).__init__(*args, **kwargs)

        student = Student.objects.get(pk=user)
        classes = StudentClassRegistration.objects.filter(student__exact=student).values_list('clazz', flat=True)
        enrolled_classes = Class.objects.filter(id__in=classes)
        non_enrolled_classes = Class.objects.exclude(id__in=classes).exclude(capacity__lte=0)

        counts = StudentClassRegistration.objects.all().values('clazz').annotate(num_students=Count('student'))
        #TODO improve this so it uses query stuff, idk how
        #can traverse the foreign key relationship backwards, might be useful
        #source: https://docs.djangoproject.com/en/3.0/topics/db/aggregation/ cheat sheet examples
        for c in counts:
            clazz = Class.objects.get(pk=c['clazz'])
            num_students = c['num_students']
            if num_students >= clazz.capacity:
                non_enrolled_classes = non_enrolled_classes.exclude(pk=clazz.id)


        self.fields['classes'].queryset = enrolled_classes if delete else non_enrolled_classes


