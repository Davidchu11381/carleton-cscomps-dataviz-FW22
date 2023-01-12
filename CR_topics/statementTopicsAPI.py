from flask import Flask, jsonify, request
import pymongo
import requests

# creating a Flask app
app = Flask(__name__)

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for politician data for the MoneyFlows comps project! \n"
        return message

# Returns top 10 industries for a specific candidate cid
@app.route('/<string:cid>/industry', methods = ['GET'])
def getAllTopicFrequencies(opensecrets_id):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    topics_collection = db['statement_topics']
    # collect all 
    #topics_collection.find({"opensecrets_id" : opensecrets_id}) # this is good, just gets all the things together tho



# need words and their frequencies by politician