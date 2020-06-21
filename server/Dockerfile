FROM python:3.8

COPY . /server
WORKDIR /server

RUN pip install pipenv
RUN pipenv install --system --deploy
