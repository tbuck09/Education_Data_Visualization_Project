#####
# Import Dependencies
#####

import os
from datetime import datetime

from flask import Flask, jsonify, render_template, redirect

from flask_pymongo import PyMongo


####################
# Initialize Flask app
####################

app= Flask(__name__)

app.config['MONGO_DBNAME']= 'seda_ed_db'
app.config["MONGO_URI"]= 'mongodb://localhost:27017/seda_ed_db'

####################
# Initialize DB
####################

mongo= PyMongo(app)
# mongo= PyMongo(app, uri= "mongodb://localhost:27017/seda_ed_db")


####################
# Set Routes
####################

@app.route("/")
def index():
    print("Request made to Root")
    
    return render_template("index.html")


@app.route("/<db_request>", methods= ["GET"])
def serve_demo_math(db_request):
    print(f"Request made to {db_request}")
    print(f"testing {db_request}")

    collections= mongo.db.collection_names()

    if db_request in collections:
        selected_db= mongo.db[db_request]
    else:
        return """
        <h1>Error:</h1>
        <h3>Invalid request</h3>
        <br>
        <span>Please make a request for a valid address</span>
        """

    output= []

    results= selected_db.find()

    for result in results:
        output.append({
            "state": result["stateabb"],
            "grade": result["grade"],
            "mean_score": result["mn_all"]
        })

    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)