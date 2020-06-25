FROM python:3.8

COPY ./server /server
COPY Pipfile* /server/
WORKDIR /server

RUN pip install pipenv
RUN pipenv install --system --deploy
