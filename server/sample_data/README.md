This folder contains the data that the `server/setup_sample_data.py` script uses to populate the database with sample data.

Data for each model is stored in a corresponding `{model_name}.tsv` file. The first line should contain the names of the fields to specify, and each subsequent line adds an instance of the model with the provided values. A field that is a reference to another object should contain the primary key value of that object in its corresponding table.

Run `docker-compose exec server python setup_sample_data.py` to execute the script in the docker environment.
