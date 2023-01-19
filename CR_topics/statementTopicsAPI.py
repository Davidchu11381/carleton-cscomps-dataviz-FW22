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
@app.route('/<string:opensecrets_id>/statement-topics', methods = ['GET'])
def getAllTopicFrequencies(opensecrets_id):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    topics_collection = db['statement_topics']
    topic_frequencies = topics_collection.findOne({"opensecrets_id":opensecrets_id}).topic_frequencies
    return jsonify(topic_frequencies)

# driver function
if __name__ == '__main__':
    app.run(debug = True)