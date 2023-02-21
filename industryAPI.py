from flask import Flask, jsonify, request
import pymongo
import heapq
import requests
from bs4 import BeautifulSoup
import re

# format the description from OpenSecrets, namely removing all the HTML tags and inserting newlines as necessary.
def format_description(text):
    text = re.sub('<[^>]*>', '', text)
    last_period_index = text.rfind('.')
    if last_period_index != -1:
        text = text[:last_period_index+1] + '\n' + text[last_period_index+1:]
    
    last_updated_index = text.rfind('Updated')
    if last_updated_index != -1:
        text = text[:last_updated_index] + '\n' + text[last_updated_index:]
    return text

def getDescription(ind):
    url = "https://www.opensecrets.org/industries/background.php?cycle=2022&ind=" + ind
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    results = soup.find(id="profileLeftColumn")
    results = format_description(results.text)
    return results

# creating a Flask app
app = Flask(__name__)

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for industry data for the MoneyFlows comps project! \n"
        return message

# Returns summary info for a specified industry code
@app.route('/<string:ind>/summary', methods = ['GET'])
def getSummary(ind):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['industries']
    dic = collection.find_one({"code": ind})
    description = getDescription(ind)

    return jsonify({"name": dic["name"], "total": dic["total"], "description": description})

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
