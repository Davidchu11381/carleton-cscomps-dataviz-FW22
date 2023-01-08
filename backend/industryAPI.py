
from flask import Flask, jsonify, request
import pymongo
import heapq

# creating a Flask app
app = Flask(__name__)

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for industry data for the MoneyFlows comps project! \n"
        return message

# Returns name of a specified industry code
@app.route('/<string:ind>/name', methods = ['GET'])
def getIndustryName(ind):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['industries']
    dic = collection.find_one({"code": ind})

    return jsonify({'data': dic["name"]})

# Returns all congresspeople for a specified industry code
@app.route('/<string:ind>', methods = ['GET'])
def getAllCongresspeople(ind):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['industries']
    dic = collection.find_one({"code": ind})

    return jsonify({'data': dic["congresspeople"]})

# Returns top k congresspeople by total donations for a specified industry code
@app.route('/<string:ind>/<int:k>', methods = ['GET'])
def getTopKCongresspeople(ind, k):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['industries']
    dic = collection.find_one({"code": ind})
    top_k = heapq.nlargest(k, dic["congresspeople"], key = lambda x : x["total"])

    return jsonify({'data': top_k})
  
# driver function
if __name__ == '__main__':
    app.run(debug = True)