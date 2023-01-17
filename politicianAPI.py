
from flask import Flask, jsonify, request
import pymongo
import requests
import xmltodict
import tweepy

opensecrets_key = "91a96cc61cceb54c2473df69372795f6" # API key

# twitter keys
consumer_key = "YauX4ahOHAxcsDgcX4zrtkWid"  #same as api key
consumer_secret = "PNezX7Ne2xEAnkomoNBuPw7NWvgQt1w5OvtxTTzgRZZNgSsGRA"  #same as api secret
access_key = "1572984312554786818-eoA2bVWAu0g9FHzhLprwAiOUOwSw5H"
access_secret = "ieTStsQ3LsfFomPAMTEgLjnWU90fODIS543LDvnihfaSn"

# gets the Twitter profile picture of a Twitter handle
def getProfilePic(handle):
    # Twitter authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
    auth.set_access_token(access_key, access_secret) 
    
    # Creating an API object 
    api = tweepy.API(auth)

    try:
        api.verify_credentials()
        user = api.get_user(screen_name=handle)
        extension = user.profile_image_url[-3:]
        url = user.profile_image_url[:-10]
        url += "bigger." + extension
        return url
    except:
        print('Failed authentication')
        
# removes all "@" symbols from keys in a dictionary
def removeAtSymbol(dict):
    return {x.translate({64:None}) : y for x, y in dict.items()}

# creating a Flask app
app = Flask(__name__)

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for politician data for the MoneyFlows comps project! \n"
        return message

# Returns all demographic information pertaining to a candidate cid
@app.route('/<string:cid>/summary', methods = ['GET'])
def getSummaryInfo(cid):
    # getting data from our database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    dic = collection.find_one({"opensecrets_id": cid})
    dic.pop("_id")
    return jsonify(dic)

# Returns top 10 industries for a specific candidate cid
@app.route('/<string:cid>/industry', methods = ['GET'])
def getTopIndustries(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2022&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format

        # remove "@" symbols
        data_dict = removeAtSymbol(data_dict) 
        data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]

        return jsonify(data_dict)
    else:
        return f"There's a {response.status_code} error with your request"

# Returns top individual contributors for a specific candidate cid
@app.route('/<string:cid>/individual', methods = ['GET'])
def getTopIndividuals(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2022&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text)["response"]["contributors"] # parse from XML to a JSON-dict format

        # remove "@" symbols
        data_dict = removeAtSymbol(data_dict) 
        data_dict["contributor"] = [removeAtSymbol(contributor_dict) for contributor_dict in data_dict["contributor"]]
        return jsonify(data_dict)
    else:
        return f"There's a {response.status_code} error with your request"

# Returns all congresspeople sorted by alphabetical order
@app.route('/all', methods = ['GET'])
def getAllCongresspeople():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list_of_congresspeople = []
    for dict in collection.find():
        dict.pop("_id")
        list_of_congresspeople.append(dict)
    list_of_congresspeople.sort(key = lambda x: x["last_name"])

    return jsonify({"data": list_of_congresspeople})
  
# driver function
if __name__ == '__main__':
    app.run(debug = True)