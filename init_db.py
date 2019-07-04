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


# read into dataframe

# all_ela_df = pd.read_csv(r"resources\datasets\all_ela.csv")
# all_math_df = pd.read_csv(r"resources\datasets\all_math.csv")
# demo_ela_df = pd.read_csv(r"resources\datasets\demo_ela.csv")
# demo_math_df = pd.read_csv(r"resources\datasets\demo_math.csv")
# merged_8_and_4_df= pd.read_csv(r"resources\datasets\merged_8_and_4.csv")
# ela_2013_df= pd.read_csv(r"resources/ela_2013.csv")
# math_2013_df= pd.read_csv(r"resources/math_2013.csv")
# ela_2013_agg_df= pd.read_csv(r"resources/ela_2013_agg.csv")
# math_2013_agg_df= pd.read_csv(r"resources/math_2013_agg.csv")


# convert to dictionary and move to mongo as collections

# db.ela_full.insert_many(all_ela_df.to_dict(orient= "records"))
# db.math_full.insert_many(all_math_df.to_dict(orient= "records"))
# db.ela_demog.insert_many(demo_ela_df.to_dict(orient= "records"))
# db.math_demog.insert_many(demo_math_df.to_dict(orient= "records"))
# db.grades_8_and_4.insert_many(merged_8_and_4_df.to_dict(orient= "records"))

# db_dict= [
#     {"db_name": "ela_2013", "collection": db.ela_2013, "db_df": ela_2013_df},
#     {"db_name": "math_2013", "collection": db.math_2013, "db_df": math_2013_df},
#     {"db_name": "ela_2013_agg", "collection": db.ela_2013_agg, "db_df": ela_2013_agg_df},
#     {"db_name": "math_2013_agg", "collection": db.math_2013_agg, "db_df": math_2013_agg_df}
# ]
    

# for dbase in db_dict:
#     if dbase["collection"].find().count() > 0:
#         # Drop redundant data
#         print(f"Dropping {dbase['db_name']}.")
#         dbase["collection"].drop()
#         # Insert to db
#         print(f"Inserting to {dbase['db_name']}.")
#         dbase["collection"].insert_many(dbase["db_df"].to_dict(orient= "records"))
#     elif dbase["collection"].find().count() == 0:
#         # Insert to db
#         print(f"Inserting to {dbase['db_name']}.")
#         dbase["collection"].insert_many(dbase["db_df"].to_dict(orient= "records"))
#     else:
#         # Something weird must've happened
#         print(f"{dbase['db_name']} is invalid.")
