


import pandas as pd
import pymongo



# Mongo connection
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to database

db = client.seda_ed_db

# file path(s)





# read into dataframe

all_ela_df = pd.read_csv(r"resources\all_ela.csv")
all_math_df = pd.read_csv(r"resources\all_math.csv")
demo_ela_df = pd.read_csv(r"resources\demo_ela.csv")
demo_math_df = pd.read_csv(r"resources\demo_math.csv")



# convert to dictionary and move to mongo as collections

db.ela_full.insert_many(all_ela_df.to_dict(orient= "records"))

db.math_full.insert_many(all_math_df.to_dict(orient= "records"))

db.ela_demog.insert_many(demo_ela_df.to_dict(orient= "records"))

db.math_demog.insert_many(demo_math_df.to_dict(orient= "records"))