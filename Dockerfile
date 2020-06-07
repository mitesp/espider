FROM python:3.8

COPY . /espider
WORKDIR /espider

RUN pip install pipenv
RUN pipenv install --system --deploy
