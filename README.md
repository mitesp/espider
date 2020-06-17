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

# Working with Heroku

For now, we're deploying through Heroku. The first things you'l need to do are 1) create a heroku
account 2) install the Heroku CLI. Before you can get started, you'll need to be added to the access
list for our shared espider project (ask any current collaborator to add you). Once you have access,
go into the git repo and log into heroku (run `heroku login`). Next, connect the git repo with
`heroku git:remote -a espider`. This will create a git remote named `heroku`. Pushing to that
remote (e.g. `git push heroku master`) triggers a new deploy.

`heroku open` will open the live website in browser.

`heroku logs --tail` will show you live website logs.

There's plenty more heroku does (e.g. ssh-ing into containers) -- see the Heroku CLI documentation
for more info.

# Troubleshooting
Make sure you don't already have things running on your localhost ports.

If you need to rebuild the databases from scratch, run `sudo docker-compose down` and then `sudo docker-compose up --build`, delete all the migrations, and re-make and build them. 

# Useful aliases
    alias dockup="sudo docker-compose up" #spins up Docker
    alias dockex="sudo docker-compose exec web" #execute things in the web shell
    alias dockman="sudo docker-compose exec web python3 manage.py" #exec
    alias dockdb="sudo docker-compose exec db psql -U postgres" #spin up the database
    alias herokumigrate="heroku run python3 server/manage.py migrate" #migrate in prod
    alias herokumakemig="heroku run python3 server/manage.py makemigrations" #make migrations in prod


