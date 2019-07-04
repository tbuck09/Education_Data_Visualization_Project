import os

import pandas as pd
import pymongo

# Define walklevel() which will walk through a designated directory (excluding subfolders under the given level)
def walklevel(some_dir, level=0):
    some_dir = some_dir.rstrip(os.path.sep)
    assert os.path.isdir(some_dir)
    num_sep = some_dir.count(os.path.sep)
    for root, dirs, files in os.walk(some_dir):
        yield root, dirs, files
        num_sep_this = root.count(os.path.sep)
        if num_sep + level <= num_sep_this:
            del dirs[:]

# Mongo connection
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to database
db = client.seda_ed_db

# Get filenames of all files in the data directory and add them to a list
data_files= []

for root, dirs, files in walklevel('./resources/data', level= 0):
    for name in files:
        data_files.append(name)

# Add each file from the directory to the MongoDB (if db already exists, drop and re-add the file)
for dbase in data_files:
    # Name db after the csv (minus ".csv")
    db_name= dbase[0:len(dbase) - 4]
    # This is the actual instance of the collection
    collection= db[db_name]
    # This is the pandas DF to be inserted into MongoDB
    db_df= pd.read_csv(f"./resources/data/{dbase}")
    # If there is already data in the DB:
    if collection.find().count() > 0:
        # Drop redundant data
        print(f"Dropping {db_name}.")
        collection.drop()
        # Insert to db
        print(f"Inserting to {db_name}.")
        collection.insert_many(db_df.to_dict(orient= "records"))
    # Otherwise, if there is no data:
    elif collection.find().count() == 0:
        # Insert to db
        print(f"Inserting to {db_name}.")
        collection.insert_many(db_df.to_dict(orient= "records"))
    # Other, otherwise:
    else:
        # Something weird must've happened
        print(f"{db_name} is invalid.")