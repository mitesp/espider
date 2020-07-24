# espider

## Table of Contents
- [Set Up](#set-up)
- [Making Changes](#making-changes)
- [Committing & Pushing Changes](#committing--pushing-changes)
  * [Setting up Linters](#setting-up-linters)
  * [Pull Requests](#pull-requests)
    + [Pull Request Message](#pull-request-message)
- [Deploying](#deploying)
- [Dev Guide (a.k.a. Help! What's going on?)](#dev-guide-aka-help-whats-going-on)
- [Troubleshooting](#troubleshooting)
- [Useful tidbits](#useful-tidbits)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Set Up

1. Install `docker`, and `docker-compose`.
2. Clone this repository: `git clone https://github.com/mitesp/espider.git`
3. Inside the project directory, run `sudo docker-compose up` to spin up
   [containers](https://www.docker.com/resources/what-container).<sup>[1](#footnote-sudo)</sup>
4. Voila! The frontend should now be running at [localhost:3000](http://localhost:3000/), and the
   backend should be running at [localhost:8000](http://localhost:8000/).

(Stopping and Restarting)

5. To stop the containers, type `Ctrl-C` -- their states will be saved on your computer (when you
   come back, the database's data will still be there).
6. To start the containers up again, run `sudo docker-compose up`.

(Miscellaneous)

7. Install linters (see Committing & Pushing Changes).
8. To pre-populate the database with sample data, run
   `sudo docker-compose exec server python setup_sample_data.py`. See the
   [sample data directory](server/sample_data/README.md) for more information on adding sample
   data.

# Making Changes

Before making changes always `git pull --rebase` to make sure you have the most updated version of
the code.

Go ahead and edit code with your [favorite](https://code.visualstudio.com/)
[text](https://www.sublimetext.com/) [editor](https://www.vim.org/) /
[IDE](https://www.jetbrains.com/pycharm/). All changes should update automatically! If it doesn't,
just stop the `sudo docker-compose up` command and re-run it.



Some useful commands:

- `docker-compose exec server`<sup>[2](#footnote-alias)</sup> runs commands inside the server
  container, so `docker-compose exec server python manage.py createsuperuser` runs
  `python manage.py createsuperuser` inside the `server` container.
- `docker-compose build` rebuilds the containers from scratch (e.g. your database is borked and you
  want a new one, or you want to [`pipenv install` a new library](https://pipenv.pypa.io/en/latest/)
  in the server container).

# Committing & Pushing Changes

## Setting up Linters

Linters help us make sure our code is
[fresh](https://stackoverflow.com/questions/8503559/what-is-linting) and
[clean](https://web.mit.edu/6.031/www/sp20/classes/04-code-review/). We use a library called
[`pre-commit`](https://pre-commit.com/), which uses [git
hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to run our linters any time you
make a commit.

0. Make sure you're in the project root directory.
1. Install [`pipenv`](https://pipenv.pypa.io/en/latest/install/#installing-pipenv).
2. Install `pre-commit` with `pipenv install pre-commit --dev`.
3. Run `pipenv run pre-commit install` to set up the git hook.

**Before committing and pushing**: it's good practice to run `git status` and `git diff` to make
sure you know what changes you're adding.

**Committing**: Use concise but descriptive commit messages and bodies. Here are [7
rules](https://chris.beams.io/posts/git-commit/#seven-rules) we roughly follow.

**Fixing lint errors**: When you commit, `pre-commit` will check for lint. If found, it'll
automatically fix the files or describe the problem. You should check over the changes or fix the
issues then re-add the files and commit.<sup>[3](#footnote-lint)</sup>

**Pushing**: Please `git pull --rebase` (no merge commits allowed!).<sup>[4](#footnote-rebase)</sup>

**Resolving conflicts**: If you run into conflicts, try fixing, readding the files, and calling
`git rebase --continue`. If that doesn't work, consider aborting, squashing, then rebasing. If you're
super worried about screwing up git, ask someone else for help!

## Pull Requests

For anything that isn't a minor change, create a new branch (`git checkout -b branch-name)`) and do
all your work there. Then create a pull request (easiest to do in the UI) and ask someone else to
review your changes. After all comments have been resolved, you can then merge all your changes
into `master` using the `Squash and Merge` button.

### Pull Request Message

Include details about the changes made in the PR. Talk about how you tested the change, to ensure
it was robust. If a PR involves frontend changes, make sure to include screenshots of the changes
in the PR message.

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

- Stream live website logs: `heroku logs --tail`
- Run commands inside web container: `heroku run <command>`
- Reset the database: `heroku pg:reset`
- SSH into the web container: `heroku ps:exec`
- Force push to `heroku` with `git push master --force`

# Dev Guide (a.k.a. Help! What's going on?)

[**Django**](https://www.djangoproject.com/) is a Python web framework -- it lets us **send and
receive messages over the internet**. It also comes with lots of existing features (it comes
"batteries-included"). It is used for the backend. We use Django as a method to more easily
communicate with the database where all information is stored.

If you'd like to get a better handle on Django, we highly recommend
[Django's official tutorial](https://docs.djangoproject.com/en/3.0/intro/tutorial01/).

The bulk of the important backend code can be found in `server/core`.
- `urls` has our url patterns for the API
- `views/` has the functions/classes called when a url is hit.
- `models/` describes the objects in our database that are touched by views.
- `admin/` specifies what goes in the
  [admin panel](https://docs.djangoproject.com/en/3.0/ref/contrib/admin/).

There are tons of things Django does, so really just go through the tutorial and use Google when
stuck.

[**React**](https://reactjs.org/) is another web framework, built in Javascript, used for the
frontend. It generates **dynamic pages**, which lets us display a better user interface and have a
better user experience.

If you'd like to get a better handle on React, we highly recommend
[React's official tutorial](https://reactjs.org/tutorial/tutorial.html).

Pretty much all of the relevant frontend code can be found in `client/src`.
- `App.tsx` is the main file. It contains routes to all the other pages.
- `apiEndpoints.ts` contains all the API links.
- `constants.ts` contains constants that are used across the website (such as pronoun options).
- `accounts/` has the views relevant to login and signup.
- `dashboard/` has the student and teacher dashboards.
- `forms/` contains helper stuff for form generation.
- `info/` has all the static info pages.
- `layout/` has the bits of the website that are visible everywhere - the navigation bar and the
  footer.
- `registration/` has the views relevant to student registration.

[**Bulma**](https://bulma.io/) is the CSS framework that we are using. The documentation is pretty
good.

The parts of Bulma that have been imported are available in `client/src/App.sass`.

There is documentation more specific to

[**Postgres**](https://www.postgresql.org/) is a database system. It's really good at handling data
-- searching, updating, deleting, almost anything you want. Django has a [fancy built-in
way](https://www.fullstackpython.com/django-orm.html) to talk to Postgres.

- There is a way to [talk to Postgres directly](http://postgresguide.com/utilities/psql.html), but
  hopefully you'll never need it since Django covers most use cases.

[**Docker**](https://www.docker.com/) and [**Docker Compose**](https://docs.docker.com/compose/)
are **container managers**. We use them for **cleanly setting up local development**.

- In the real world, web frameworks/servers and databases run on different machines (i.e. not your
  singular laptop).
- Docker and Docker Compose help your computer emulate this by setting up **containers** -- little
  (mostly) isolated environments.
- Running `docker-compose up` for the first time sets up the containers (creates containers, puts
  our code inside them, installs libraries). When stopped, those same containers go to sleep (but
  they're still there on your computer). The next `docker-compose up` will just wake them up. If
  you want to rebuild the containers from scratch, run `docker-compose build`.
- They also figure out all the library installation/networking for us!
- Hopefully you won't need to touch the config ever (`Dockerfile` and `docker-compose.yaml`) --
  after being set up one they should just work!

[**Heroku**](https://www.heroku.com/) is what's called a
[**Platform-as-a-Service**](https://en.wikipedia.org/wiki/Platform_as_a_service). They **streamline
the process of deploying** websites.

- They take care of lots of little things we don't want to think about like keeping the physical
  machine running, installing the appropriate libraries, setting up network configuration, some
  network security, etc.
- While there are plenty of services, Heroku does more than most (others often just say here, you
  can use one of our machines, here's how you access it).
- This also means it's generally more expensive, but we're on the **free tier**.
- They also use some form of containers (and could actually be configured to use Docker if we
  wanted).
- Their [CLI](https://devcenter.heroku.com/articles/heroku-cli) is pretty powerful and they
  generally have good tutorials.
- Since Heroku is the expensive side of the spectrum, our plan is to use it until it's not worth
  the money.

[**Pipenv**](https://pipenv.pypa.io/en/latest/) is our python package manager. Basically, if you
ever need an external library, try `pipenv install <library>`.

- It keeps our libraries in `Pipfile` and the full library list in `Pipfile.lock` (libraries often
  depend on other libraries).
- `pipenv graph` should show you what libraries we use.
- `pipenv run <command>` runs the command using python environment defined by the Pipfile (this is
  the equivalent of using a [virtualenv](https://docs.python-guide.org/dev/virtualenvs/))

**General Tutorials**:

- [Mozilla](https://developer.mozilla.org/en-US/docs/Web) has some good tutorials about all aspects
  of web development.
- [Full Stack Python](https://www.fullstackpython.com/) also has some good explanations of web dev
  topics with links to stuff other people have written.

# Troubleshooting

- Make sure you don't already have things running on your localhost ports.
- Make sure you are using Python 3.

# Useful tidbits

<a name="footnote-sudo">1</a>: If you get tired of typing `sudo` in front of `docker-compose`,
[you can do that](https://docs.docker.com/engine/install/linux-postinstall/).

<a name="footnote-alias">2</a>: If you just generally feel too lazy to type things, we encourage
using [aliases](https://tldp.org/LDP/abs/html/aliases.html).
Here are Mayukha's favorite aliases:

    alias dockup="sudo docker-compose up" #spins up Docker
    alias dockex="sudo docker-compose exec server" #execute things in the server shell
    alias dockman="sudo docker-compose exec server python manage.py" #exec
    alias dockdb="sudo docker-compose exec db psql -U postgres" #spin up the database
    alias herokumigrate="heroku run python server/manage.py migrate" #migrate in prod

<a name="footnote-lint">3</a>: Our lint setup is in `.pre-commit-config.yaml`. Hopefully you won't
need to touch it, but if you do, `pipenv run pre-commit run -a` will run the linter.

<a name="footnote-rebase">4</a>: You can set this to be the default by running
`git config pull.rebase true`.
