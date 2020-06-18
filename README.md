# espider

# Set Up
1. Install `docker`, and `docker-compose`.
2. Clone this repository: `git clone https://github.com/mitesp/espider.git`
3. Inside the project directory, run `sudo docker-compose up` to spin up
   [containers](https://www.docker.com/resources/what-container).\*
4. Voila! The website should now be running locally at [localhost:8000](http://localhost:8000/).

(Stopping and Restarting)

5. To stop the containers, type `Ctrl-C` -- their states will be saved on your computer (when you
   come back, the database's data will still be there).
6. To start the containers up again, run `sudo docker-compose up`.

# Making Changes
Go ahead and edit code with your [favorite](https://code.visualstudio.com/)
[text](https://www.sublimetext.com/) [editor](https://www.vim.org/) /
[IDE](https://www.jetbrains.com/pycharm/). All changes should update automatically!

Some useful commands:
* `docker-compose exec web`\*\* runs commands inside the web container, so `docker-compose exec web
  python manage.py createsuperuser` runs `python manage.py createsuperuser` inside the `web`
container.
* `docker-compose build` rebuilds the containers from scratch (e.g. your database is borked and you
  want a new one, or you want to [`pipenv install` a new library](https://pipenv.pypa.io/en/latest/)
in the web container).

# Comitting & Pushing Changes
The first time you clone the repository, you'll need to run `pipenv run pre-commit run --all-files`
(you should only need to run this once ever). [`pre-commit`](https://pre-commit.com/) uses [git
hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to make sure our code is
[fresh](https://stackoverflow.com/questions/8503559/what-is-linting) and
[clean](https://ocw.mit.edu/ans7870/6/6.005/s16/classes/04-code-review/).

**Before committing and pushing**: it's good practice to run `git status` and `git diff` to make
sure you know what changes you're adding.
**Committing**: Use concise but descriptive commit messages and bodies. Here are [7
rules](https://chris.beams.io/posts/git-commit/#seven-rules) we roughly follow.  **Fixing lint
errors**: When you commit, `pre-commit` will check for lint. If found, it'll automatically fix the
files, which you should then check for correctness and re add to the commit.\*\*\*
**Pushing**: Please `git pull --rebase` (no merge commits allowed!).\*\*\*\*
**Resolving conflicts**: If you run into conflicts, try fixing, readding the files, and calling `git
rebase --continue`. If that doesn't work, consider aborting, squashing, then rebasing. If you're
super worried about screwing up git, ask someone else for help!

# Deploying
For now, we're using [Heroku](https://www.heroku.com/) to deploy to
[espider.herokuapp.com](https://espider.herokuapp.com/).

If you'd like to have this power, you'll need to:
1. Create a Heroku account
2. Get added to the project access list (ask any current collaborator).
3. Install the Heroku CLI and run `heroku login` in the git repo.
4. Connect the your code to heroku with `heroku git:remote -a espider`. This will create a git
   remote named `heroku`.
5. Deploy with `git push heroku master`.

Useful tools:
* Stream live website logs: `heroku logs --tail`
* Run commands inside web container: `heroku run <command>`
* Reset the database: `heroku pg:reset`
* SSH into the web container: `heroku ps:exec`

Notes: Heroku has a different working directory than Docker, so you'll need `python
server/manage.py` instead of `python manage.py`.

# Dev Guide (a.k.a. Help! What's going on?)
[**Django**](https://www.djangoproject.com/) is a web framework -- it lets us **send and receive
messages over the internet**. It also comes with lots of existing features (it comes
"batteries-included").
* If you'd like to get a better handle on Django, we recommend [Django's official
  tutorial](https://docs.djangoproject.com/en/3.0/intro/tutorial01/).
* At a vague super high level, when you go to some URL (e.g. `localhost:8000/students`), **(1)**
  Django looks inside [`urls.py`](https://docs.djangoproject.com/en/3.0/topics/http/urls/) for the
matching URL. **(2)** It calls the specified [**view**
function/class](https://docs.djangoproject.com/en/3.0/topics/http/views/) which does something
(maybe lookup or edit something in the database), then **(3)** it returns some HTML to the user
often based on a [**template**](https://docs.djangoproject.com/en/3.0/topics/templates/).
* Django comes with built-in [Users](https://docs.djangoproject.com/en/3.0/topics/auth/) and
  [Forms](https://docs.djangoproject.com/en/3.0/topics/forms/) which make it super easy to set
things up (honestly that's what *most* of the website really does anyway).
* The bulk of the important backend code can be found in `server/core`.
    * `urls` has our url patterns
    * `views` has the functions/classes called when a url is hit.
    * `forms` has the forms often referenced by views.
    * `models` describes the objects in our database that are touched by views/forms.
    * `templates` has the actual HTML pages we return to users upon completion of a view.
    * `admin` specifies what goes in the [admin panel](https://docs.djangoproject.com/en/3.0/ref/contrib/admin/).
* There are tons of things Django does, so really just go through the tutorial and use Google when
  stuck.

[**Postgres**](https://www.postgresql.org/) is a database system. It's really good at handling data
-- searching, updating, deleting, almost anything you want. Django has a [fancy built-in
way](https://www.fullstackpython.com/django-orm.html) to talk to Postgres.

[**Docker**](https://www.docker.com/) and [**Docker Compose**](https://docs.docker.com/compose/) are
**container managers**. We use them for **cleanly setting up local development**.
* In the real world, web frameworks/servers and databases run on different machines (i.e. not your
  singular laptop).
* Docker and Docker Compose help your computer emulate this by setting up **containers** -- little
  (mostly) isolated environments.
* Running `docker-compose up` for the first time sets up the containers. When stopped, those same
  containers go to sleep (but they're still there on your computer). The next  `docker-compose up`
will just wake them up. If you want to rebuild the containers from scratch, run `docker-compose
build`.
* They also figure out all the library installation/networking for us!
* Hopefully you won't need to touch the config ever (`Dockerfile` and `docker-compose.yaml`) --
  after being set up one they should just work!

[**Heroku**](https://www.heroku.com/) is what's called a
[**Platform-as-a-Service**](https://en.wikipedia.org/wiki/Platform_as_a_service). They **streamline
the process of deploying** websites.
* They take care of lots of little things we don't want to think about like keeping the physical
  machine running, installing the appropriate libraries, setting up network configuration, some
network security, etc.
* While there are plenty of services, Heroku does more than most (others often just say here, you
  can use one of our machines, here's how you access it).
* This also means it's generally more expensive, but we're on the **free tier**.
* They also use some form of containers (and could actually be configured to use Docker if we
  wanted).
* Their [CLI](https://devcenter.heroku.com/articles/heroku-cli) is pretty powerful and they
  generally have good tutorials.
* Since Heroku is the expensive side of the spectrum, our plan is to use it until it's not worth the
  money.

[**Pipenv**](https://pipenv.pypa.io/en/latest/) is our python package manager. Basically, if you
ever need an external library, try `pipenv install <library>`.
* It keeps our libraries in `Pipfile` and the full library list in `Pipfile.lock` (libraries often
  depend on other libraries).
* `pipenv graph` should show you what libraries we use.
* `pipenv run <command>` runs the command using python environment defined by the Pipfile (this is
  the equivalent of using a [virtualenv](https://docs.python-guide.org/dev/virtualenvs/))

**General Tutorials**:
* [Mozilla](https://developer.mozilla.org/en-US/docs/Web) has some good tutorials about all aspects
  of web development.
* [Full Stack Python](https://www.fullstackpython.com/) also has some good explanations of web dev
  topics with links to stuff other people have written.

# Troubleshooting
Make sure you don't already have things running on your localhost ports.

# Useful tidbits
\* If you get tired of typing `sudo` in front of  `docker-compose`, [you can do
that](https://docs.docker.com/engine/install/linux-postinstall/).
\*\* If you just generally feel too lazy to type things, we encourage using
[aliases](https://tldp.org/LDP/abs/html/aliases.html).
Here are Mayukha's favorite aliases:

    alias dockup="sudo docker-compose up" #spins up Docker
    alias dockex="sudo docker-compose exec web" #execute things in the web shell
    alias dockman="sudo docker-compose exec web python3 manage.py" #exec
    alias dockdb="sudo docker-compose exec db psql -U postgres" #spin up the database
    alias herokumigrate="heroku run python3 server/manage.py migrate" #migrate in prod
    alias herokumakemig="heroku run python3 server/manage.py makemigrations" #make migrations in
prod

 \*\*\* Our lint setup is in `.pre-commit-config.yaml`. Hopefully you won't need to touch it, but if
you do, `pipenv run  pre-commit run -a` will run the linter.
 \*\*\*\* You can set this to be the default by running `git config pull.rebase true`.
