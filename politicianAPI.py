
from flask import Flask, jsonify, request
import pymongo
import requests
import xmltodict
import tweepy
from collections import defaultdict

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

# Returns topic distribution for list of congresspeople
@app.route('/<string:cid_list>/topicList', methods = ['GET'])
def getTopicsList(cid_list):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['topics']
    topics_dict = defaultdict(int)
    topics_dict["opensecrets_ids"] = cid_list

    for cid in cid_list:
        # get topic distributions for all tweets by this politician
        for dict in collection.find({"opensecrets_id": cid}):

            # get max topic distribution value
            max_value = 0
            for i in range(1,13):
                topic = "topic_" + str(i)
                if float(dict[topic]) > max_value:
                    max_value = float(dict[topic])

            # find all topics with that value
            max_topics = []
            for i in range(1,13):
                topic = "topic_" + str(i)
                if float(dict[topic]) == max_value:
                    max_topics.append(topic)

            # increment count for those topics
            for topic in max_topics:
                topics_dict[topic] += 1

    return jsonify({"data": topics_dict})

# Returns topic distribution for a congressperson
@app.route('/<string:cid>/topics', methods = ['GET'])
def getTopics(cid):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['topics']
    topics_dict = defaultdict(int)
    topics_dict["opensecrets_id"] = cid

    # get topic distributions for all tweets by this politician
    for dict in collection.find({"opensecrets_id": cid}):

        # get max topic distribution value
        max_value = 0
        for i in range(1,13):
            topic = "topic_" + str(i)
            if float(dict[topic]) > max_value:
                max_value = float(dict[topic])

        # find all topics with that value
        max_topics = []
        for i in range(1,13):
            topic = "topic_" + str(i)
            if float(dict[topic]) == max_value:
                max_topics.append(topic)

        # increment count for those topics
        for topic in max_topics:
            topics_dict[topic] += 1

    return jsonify({"data": topics_dict})

# Returns all information pertaining to a candidate cid
@app.route('/<string:cid>/summary', methods = ['GET'])
def getSummaryInfo(cid):
    # getting data from our database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    dic = collection.find_one({"opensecrets_id": cid})
    dic.pop("_id")
    return jsonify(dic)

# Returns all information pertaining to a candidate cid
@app.route('/<string:cid>/industry', methods = ['GET'])
def getIndustries(cid):
    # getting data from our database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    dic = collection.find_one({"opensecrets_id": cid})
    return jsonify({"industry": dic["industry"]})

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

# Returns all Republicans sorted by alphabetical order
@app.route('/republicans/<string:sort>', methods = ['GET'])
def getAllRepublicans(sort):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list = []
    for dict in collection.find({"party": "Republican"}):
        dict.pop("_id")
        list.append(dict)
    if sort == "alphabetical":
        list.sort(key = lambda x: x["last_name"])
    elif sort == "total":
        list.sort(key = lambda x: x["total"])

    return jsonify({"data": list})
  
# Returns all Democrats sorted by alphabetical order
@app.route('/democrats/<string:sort>', methods = ['GET'])
def getAllDemocrats(sort):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list = []
    for dict in collection.find({"party": "Democrat"}):
        dict.pop("_id")
        list.append(dict)
    if sort == "alphabetical":
        list.sort(key = lambda x: x["last_name"])
    elif sort == "total":
        list.sort(key = lambda x: x["total"])

    return jsonify({"data": list})

# Returns all Senators sorted by alphabetical order
@app.route('/senators/<string:sort>', methods = ['GET'])
def getAllSenators(sort):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list = []
    for dict in collection.find({"type": "sen"}):
        dict.pop("_id")
        list.append(dict)
    if sort == "alphabetical":
        list.sort(key = lambda x: x["last_name"])
    elif sort == "total":
        list.sort(key = lambda x: x["total"])

    return jsonify({"data": list})

# Returns all Representatives sorted by alphabetical order
@app.route('/representatives/<string:sort>', methods = ['GET'])
def getAllRepresentatives(sort):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list = []
    for dict in collection.find({"type": "rep"}):
        dict.pop("_id")
        list.append(dict)
    if sort == "alphabetical":
        list.sort(key = lambda x: x["last_name"])
    elif sort == "total":
        list.sort(key = lambda x: x["total"])

    return jsonify({"data": list})

# driver function
if __name__ == '__main__':
    app.run(debug = True)