


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

# all_ela_df = pd.read_csv(r"resources\datasets\all_ela.csv")
# all_math_df = pd.read_csv(r"resources\datasets\all_math.csv")
# demo_ela_df = pd.read_csv(r"resources\datasets\demo_ela.csv")
# demo_math_df = pd.read_csv(r"resources\datasets\demo_math.csv")
# merged_8_and_4_df= pd.read_csv(r"resources\datasets\merged_8_and_4.csv")
# ela2015_df= pd.read_csv(r"resources/ela_2015.csv")
# math2015_df= pd.read_csv(r"resources/math_2015.csv")



# convert to dictionary and move to mongo as collections

# db.ela_full.insert_many(all_ela_df.to_dict(orient= "records"))
# db.math_full.insert_many(all_math_df.to_dict(orient= "records"))
# db.ela_demog.insert_many(demo_ela_df.to_dict(orient= "records"))
# db.math_demog.insert_many(demo_math_df.to_dict(orient= "records"))
# db.grades_8_and_4.insert_many(merged_8_and_4_df.to_dict(orient= "records"))
# db.ela_2015.insert_many(ela2015_df.to_dict(orient= "records"))
# db.math_2015.insert_many(math2015_df.to_dict(orient= "records"))

# read into dataframe

# all_ela_df = pd.read_csv(r"resources\datasets\all_ela.csv")
# all_math_df = pd.read_csv(r"resources\datasets\all_math.csv")
# demo_ela_df = pd.read_csv(r"resources\datasets\demo_ela.csv")
# demo_math_df = pd.read_csv(r"resources\datasets\demo_math.csv")
# merged_8_and_4_df= pd.read_csv(r"resources\datasets\merged_8_and_4.csv")
ela_2013_state_agg_df= pd.read_csv(r"resources/ela_2013_state_agg.csv")
math_2013_state_agg_df= pd.read_csv(r"resources/math_2013_state_agg.csv")
ela_2013_agg_df= pd.read_csv(r"resources/ela_2013_agg.csv")
math_2013_agg_df= pd.read_csv(r"resources/math_2013_agg.csv")


# convert to dictionary and move to mongo as collections

# db.ela_full.insert_many(all_ela_df.to_dict(orient= "records"))
# db.math_full.insert_many(all_math_df.to_dict(orient= "records"))
# db.ela_demog.insert_many(demo_ela_df.to_dict(orient= "records"))
# db.math_demog.insert_many(demo_math_df.to_dict(orient= "records"))
# db.grades_8_and_4.insert_many(merged_8_and_4_df.to_dict(orient= "records"))

db_dict= [
    {"db_name": "ela_2013_state_agg", "collection": db.ela_2013_state_agg, "db_df": ela_2013_state_agg_df},
    {"db_name": "math_2013_state_agg", "collection": db.math_2013_state_agg, "db_df": math_2013_state_agg_df},
    {"db_name": "ela_2013_agg", "collection": db.ela_2013_agg, "db_df": ela_2013_agg_df},
    {"db_name": "math_2013_agg", "collection": db.math_2013_agg, "db_df": math_2013_agg_df}
]
    

for dbase in db_dict:
    if dbase["collection"].find().count() > 0:
        # Drop redundant data
        print(f"Dropping {dbase['db_name']}.")
        dbase["collection"].drop()
        # Insert to db
        print(f"Inserting to {dbase['db_name']}.")
        dbase["collection"].insert_many(dbase["db_df"].to_dict(orient= "records"))
    elif dbase["collection"].find().count() == 0:
        # Insert to db
        print(f"Inserting to {dbase['db_name']}.")
        dbase["collection"].insert_many(dbase["db_df"].to_dict(orient= "records"))
    else:
        # Something weird must've happened
        print(f"{dbase['db_name']} is invalid.")