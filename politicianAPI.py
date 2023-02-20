from flask import Flask, jsonify, request
import pymongo
import requests
import xmltodict
import tweepy
from collections import defaultdict
import heapq

opensecrets_key = "91a96cc61cceb54c2473df69372795f6" # API key

# twitter keys
consumer_key = "YauX4ahOHAxcsDgcX4zrtkWid"  #same as api key
consumer_secret = "PNezX7Ne2xEAnkomoNBuPw7NWvgQt1w5OvtxTTzgRZZNgSsGRA"  #same as api secret
access_key = "1572984312554786818-eoA2bVWAu0g9FHzhLprwAiOUOwSw5H"
access_secret = "ieTStsQ3LsfFomPAMTEgLjnWU90fODIS543LDvnihfaSn"

# returns dict containing distribution of statement topics for the given cid list.
def getStatementTopicsDict(cid_list):
    # access our mongodb database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['statement_topics']
    cid_set = set()
    topics_dict = defaultdict(int) # tracks topic names(keys) and the number of Tweets where a specific topic had the highest prob(values)
    threshold = 0.15 # threshold for probability value to determine that a statement belongs with a certain topic
    junk_topics = ["topic_1", "topic_6", "topic_7", "topic_11", "topic_14", "topic_15", "topic_21"]
    junk_topics = set(junk_topics)

    # iterate through each congressperson
    for cid in cid_list:
        if cid in cid_set:
            continue
        cid_set.add(cid)
        # get topic distributions for all statements by this congressperson
        for dict in collection.find({"opensecrets_id": cid}):
            max_topics = []
            for i in range(1,26):
                topic = "topic_" + str(i)
                if float(dict[topic]) > threshold:
                    max_topics.append(topic)
            # increment count for those topics
            for topic in max_topics:
                if topic not in junk_topics:
                    topics_dict[topic] += 1
    return topics_dict

# returns dict containing distribution of tweet topics for the given cid list.
def getTweetTopicsDict(cid_list):
    # access our mongodb database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['tweet_topics']
    cid_set = set()
    topics_dict = defaultdict(int) # tracks topic names(keys) and the number of Tweets where a specific topic had the highest prob(values)

    # iterate through each congressperson
    for cid in cid_list:
        if cid in cid_set:
            continue
        cid_set.add(cid)
        # get topic distributions for all tweets by this politician
        for dict in collection.find({"opensecrets_id": cid}):

            # get max topic distribution value for this tweet
            max_value = 0
            for i in range(1,13):
                topic = "topic_" + str(i)
                if float(dict[topic]) > max_value:
                    max_value = float(dict[topic])
            
            # setting a threshold to include the tweet in the calculation. If it's too low, skip to next
            if max_value < 0.13:
                continue

            # find all topics with that value
            max_topics = set()
            for i in range(1,13):
                topic = "topic_" + str(i)
                if float(dict[topic]) == max_value:
                    # combines topic 5 and 2
                    if topic == "topic_5":
                        topic = "topic_2"
                    max_topics.add(topic)

            # increment count for those topics
            for topic in list(max_topics):
                topics_dict[topic] += 1
    return topics_dict

# gets industry funding data for a list of cid's
def getIndustryData(cid_list):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    cid_set = set() # to make sure we don't ever duplicate same congressperson's info
    aggregate_industry_dict = defaultdict(float) # tracks industry names(keys) and total donations from those industries to the group(values)
    name_to_code = defaultdict(str) # maps industry names to their industry codes
    
    # iterate through each congressperson
    for cid in cid_list:
        if cid in cid_set:
            continue
        cid_set.add(cid)
        dic = collection.find_one({"opensecrets_id": cid})
        if not "industry" in dic:
            continue
        industry_dicts = dic["industry"]
        # iterate through the congressperson's top 10 industries and add to aggregate dict
        for industry_dict in industry_dicts:
            name_to_code[industry_dict["industry_name"]] = industry_dict["industry_code"]
            aggregate_industry_dict[industry_dict["industry_name"]] += float(industry_dict["total"])
    
    # format output
    res = []
    for industry_name, total in aggregate_industry_dict.items():
        res.append({"industry_name": industry_name, "industry_code": name_to_code[industry_name], "total": total})
    return res

# removes all "@" symbols from keys in a dictionary
def removeAtSymbol(dict):
    return {x.translate({64:None}) : y for x, y in dict.items()}

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

# home route
@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        message = "Hi, this is an API for politician data for the MoneyFlows comps project! \n"
        return message

# Returns tweet topic distribution for a congressperson(s)
# For just one congressperson, cid_list is just the cid.
# If there are multiple congresspeople, cid_list is a comma-delimited list of cid's. ex. "N00007360,N00007361,N00007362"
@app.route('/<string:cid_list>/tweet_topics', methods = ['GET'])
def getTweetTopics(cid_list):
    cid_list = cid_list.split(",") # splits input into a list of cid's
    topics_dict = getTweetTopicsDict(cid_list)
    response = jsonify({"tweet_topics": topics_dict})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns statement topic distribution for a congressperson(s)
# For just one congressperson, cid_list is just the cid.
# If there are multiple congresspeople, cid_list is a comma-delimited list of cid's. ex. "N00007360,N00007361,N00007362"
@app.route('/<string:cid_list>/statement_topics', methods = ['GET'])
def getStatementTopics(cid_list):
    cid_list = cid_list.split(",") # splits input into a list of cid's
    topics_dict = getStatementTopicsDict(cid_list)
    response = jsonify({"statement_topics": topics_dict})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns statement topic distribution for a congressperson(s)
# For just one congressperson, cid_list is just the cid.
# If there are multiple congresspeople, cid_list is a comma-delimited list of cid's. ex. "N00007360,N00007361,N00007362"
# @app.route('/<string:cid_list>/statement_topics', methods = ['GET'])
# def getStatementTopics(cid_list):
#     cid_list = cid_list.split(",") # splits input into a list of cid's
#     topics_dict = getStatementTopicsDict(cid_list)
#     return jsonify({"statement_topics": topics_dict})

# Returns top 10 industries for a congressperson(s)
# For just one congressperson, cid_list is just the cid.
# If there are multiple congresspeople, cid_list is a comma-delimited list of cid's. ex. "N00007360,N00007361,N00007362"
@app.route('/<string:cid_list>/industry', methods = ['GET'])
def getIndustries(cid_list):
    cid_list = cid_list.split(",")
    res = getIndustryData(cid_list)
    top_k = heapq.nlargest(10, res, key = lambda x : x["total"])
    response = jsonify({"industry": top_k})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all aggregate information pertaining to a group
# group can be equal to anything of the following: "Republican", "Democrat", "Senator", "Representative"
@app.route('/<string:group>/aggregate', methods = ['GET'])
def getAggregatedData(group):
    # getting data from our database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    tweet_topics_collection = db['aggregate_tweet_topics']
    industry_collection = db['aggregate_industry_data']
    statement_topics_collection = db['aggregate_statement_topics']

    tweet_topics_dic = tweet_topics_collection.find_one({"group": group})
    tweet_topics_dic.pop("_id")

    industry_dic = industry_collection.find_one({"group": group})
    industry_dic.pop("_id")

    statement_topics_dic = statement_topics_collection.find_one({"group": group})
    statement_topics_dic.pop("_id")

    top_k = heapq.nlargest(10, industry_dic["industry"], key = lambda x : x["total"])

    response = jsonify({"group": group, "tweet_topics": tweet_topics_dic["tweet_topics"], "statement_topics" : statement_topics_dic["statement_topics"], "industry": top_k})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all information pertaining to a candidate cid
@app.route('/<string:cid>/summary', methods = ['GET'])
def getSummaryInfo(cid):
    # getting data from our database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    dic = collection.find_one({"opensecrets_id": cid})
    dic.pop("_id")
    response = jsonify({"summary": dic})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all Republicans sorted by alphabetical order or by total donations
@app.route('/cid_to_summary', methods = ['GET'])
def getCIDToSummaryMapping():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    res = {}
    for dict in collection.find():
        dict.pop("_id")
        new_dict = {}
        new_dict["type"] = dict["type"]
        new_dict["full_name"] = dict["full_name"]
        new_dict["state"] = dict["state"]
        new_dict["party"] = dict["party"]
        new_dict["id"] = dict["opensecrets_id"]
        res[dict["opensecrets_id"]] = new_dict
    response = jsonify({"data": res})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all Republicans sorted by alphabetical order or by total donations
@app.route('/cid_to_summary', methods = ['GET'])
def getCIDToSummaryMapping():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    res = {}
    for dict in collection.find():
        dict.pop("_id")
        new_dict = {}
        new_dict["type"] = dict["type"]
        new_dict["full_name"] = dict["full_name"]
        new_dict["state"] = dict["state"]
        res[dict["opensecrets_id"]] = new_dict

    return jsonify({"data": res})

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
        response = jsonify(data_dict)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return response
    else:
        return f"There's a {response.status_code} error with your request"

# Returns all Republicans sorted by alphabetical order or by total donations
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

    cid_list = [dict["opensecrets_id"] for dict in list]
    response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response
  
# Returns all Democrats sorted by alphabetical order or by total donations
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

    cid_list = [dict["opensecrets_id"] for dict in list]
    response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all Senators sorted by alphabetical order or by total donations
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

    cid_list = [dict["opensecrets_id"] for dict in list]

    response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all Representatives sorted by alphabetical order or by total donations
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

    cid_list = [dict["opensecrets_id"] for dict in list]

    response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# Returns all congresspeople from a state 
@app.route('/<string:state>/state', methods = ['GET'])
def getCongresspeopleByState(state):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    collection = db['congresspeople']
    list = []
    for dict in collection.find({"state": state}):
        dict.pop("_id")
        list.append(dict)

    cid_list = [dict["opensecrets_id"] for dict in list]
    response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

@app.route('/allSummaries', methods = ['GET'])
def getAllSummaries():
    allSen = getAllSenators("total")
    allRep = getAllRepresentatives("total")
    response = jsonify({"sen": allSen, "rep": allRep})
    # client = pymongo.MongoClient("mongodb://localhost:27017/")
    # db = client['comps']
    # collection = db['congresspeople']
    # list = []
    # for dict in collection.find({"state": state}):
    #     dict.pop("_id")
    #     list.append(dict)

    # cid_list = [dict["opensecrets_id"] for dict in list]
    # response = jsonify({"data": ",".join(cid_list)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

# driver function
if __name__ == '__main__':
    app.run(debug = True)