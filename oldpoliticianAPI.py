
# DO NOT USE THIS ONE!!!!

from flask import Flask, jsonify, request
import pymongo
import requests
import xmltodict
import tweepy
from flask_cors import CORS, cross_origin

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

# creating a Flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# home route
@app.route('/', methods = ['GET'])
@cross_origin()
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for politician data for the MoneyFlows comps project! \n"
        return message

# Returns all demographic information pertaining to a candidate cid
@app.route('/<string:cid>/summary', methods = ['GET'])
@cross_origin()
def getSummaryInfo(cid):
    endpoint = "http://www.opensecrets.org/api/?method=candSummary&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        # data from OpenSecrets
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        
        # data from our database
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = client['comps']
        collection = db['congresspeople']
        dic = collection.find_one({"opensecrets_id": cid})

        # combining both sets of data
        data_dict["response"]["summary"]["@birthday"] = dic['birthday']
        data_dict["response"]["summary"]["@gender"] = dic['gender']
        data_dict["response"]["summary"]["@url"] = dic['url']
        twitter_handle = dic['twitter']
        data_dict["response"]["summary"]["@twitter"] = twitter_handle
        profile_pic_url = getProfilePic(twitter_handle)
        data_dict["response"]["summary"]["@profile_picture"] = profile_pic_url

        return jsonify(data_dict["response"]["summary"])
    else:
        return f"There's a {response.status_code} error with your request"

# Returns top 10 industries for a specific candidate cid
@app.route('/<string:cid>/industry', methods = ['GET'])
@cross_origin()
def getTopIndustries(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        return jsonify(data_dict["response"]["industries"])
    else:
        return f"There's a {response.status_code} error with your request"

# Returns top individual contributors for a specific candidate cid
@app.route('/<string:cid>/individual', methods = ['GET'])
@cross_origin()
def getTopIndividuals(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2020&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        return jsonify(data_dict["response"]["contributors"])
    else:
        return f"There's a {response.status_code} error with your request"
  
# driver function
if __name__ == '__main__':
    app.run(debug = True)
