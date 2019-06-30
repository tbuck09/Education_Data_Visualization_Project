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

    ela_demog= mongo.db.ela_demog
    math_demog= mongo.db.math_demog
    ela_full= mongo.db.ela_full
    math_full= mongo.db.math_full
    
    if db_request == "ela_demog":
        selected_db= ela_demog
    elif db_request == "math_demog":
        selected_db= math_demog
    elif db_request == "ela_full":
        selected_db= ela_full
    elif db_request == "math_full":
        selected_db= math_full
    else:
        return """
        <h1>Error:</h1>
        <span>Invalid request</span>
        <span>Please make a request for a valid address</span>
        """

    output= []

    results= selected_db.find()

    for result in results:
        output.append({
            "name": result["leaname"],
            "state": result["stateabb"],
            "grade": result["grade"],
            "year": result["year"],
            "subject": result["subject"],
            "mean_score": result["mn_all"]
        })

    return jsonify(output)


if __name__ == "__main__":
    app.run(debug=True)