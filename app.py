#####
# Import Dependencies
#####

import os
from datetime import datetime

from flask import Flask, render_template, redirect

# from flask_pymongo import PyMongo

# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func


####################
# Initialize Flask app
####################

app= Flask(__name__)


####################
# Initialize DB
####################

# mongo= PyMongo(app, uri= "mongodb://localhost:27017/education_db")


# engine= create_engine("sqlite:///resources/education_db.sqlite")

# Base= automap_base()
# Base.prepare(engine, reflect= True)

# Measurement= Base.classes.measurement
# Station= Base.classes.station

# session= Session(engine)


####################
# Set Routes
####################

@app.route("/")
def index():
    print("Request made to Root")
    
    return render_template("index.html")


if __name__ == "__main__":
    app.run()