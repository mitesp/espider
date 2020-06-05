# espider

# How to Contribute
Clone this repository.

Install `docker`, and `docker-compose`.

`sudo docker-compose up` will spin up containers that run the website locally at
[localhost:8000](http://localhost:8000/)

Changes should automatically update in the containers.

To stop the containers, type `ctrl-C`.

You can use `docker-compose exec` to run commands inside containers while they're running. For
example, `docker-compose exec web python manage.py createsuperuser` runs `python manage.py
createsuperuser` inside the `web` container.

Finally `pipenv` manages our Python packages. You can install packages with `pipenv install` and
view current packages with `pipenv graph`. Note that if you install new packages you should rebuild
your Docker containers with `docker-compose build`.

# Troubleshooting
Make sure you don't already have things running on your localhost ports.
