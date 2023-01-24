
from flask import Flask, jsonify, request
import heapq
import requests
import xmltodict
from flask_cors import CORS

key = "91a96cc61cceb54c2473df69372795f6" # API key

# creating a Flask app
app = Flask(__name__)
CORS(app)

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for politician data for the MoneyFlows comps project! \n"
        return message
#data tester route
@app.route('/testdata')
def get_data():
    return {
    "cand_name": "Ocasio-Cortez, Alexandria",
    "cash_on_hand": "4297382.94",
    "chamber": "H",
    "cid": "N00041162",
    "cycle": "2020",
    "debt": "0",
    "first_elected": "2018",
    "last_updated": "12/31/2020",
    "next_election": "2020",
    "origin": "Center for Responsive Politics",
    "party": "D",
    "source": "https://www.opensecrets.org/members-of-congress/summary?cid=N00041162&cycle=2020",
    "spent": "16735422.4",
    "state": "NY",
    "total": "20664795.04"
    }

# Returns summary info for a specific candidate cid
@app.route('/<string:cid>/summary', methods = ['GET'])
def getSummaryInfo(cid):
    endpoint = "http://www.opensecrets.org/api/?method=candSummary&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        return data_dict["response"]["summary"]
    else:
        return f"There's a {response.status_code} error with your request"

# Returns top 10 industries for a specific candidate cid
@app.route('/<string:cid>/industry', methods = ['GET'])
def getTopIndustries(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        return data_dict["response"]["industries"]
    else:
        return f"There's a {response.status_code} error with your request"

# Returns top individual contributors for a specific candidate cid
@app.route('/<string:cid>/individual', methods = ['GET'])
def getTopIndividuals(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        return data_dict["response"]["contributors"]
    else:
        return f"There's a {response.status_code} error with your request"
  
# driver function
if __name__ == '__main__':
    app.run(debug = True)