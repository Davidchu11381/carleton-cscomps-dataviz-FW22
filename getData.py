import csv
import pymongo
import xmltodict
import requests
from politicianAPI import removeAtSymbol, getTweetTopicsDict, getIndustryData, getProfilePic, getStatementTopicsDict

path_to_legislators = '/home/dataviz/Downloads/legislators-current.csv'
path_to_industries = '/home/dataviz/Downloads/CRPIndustryCodes.csv'
path_to_tweet_topics = '/home/dataviz/Downloads/tweets_topics_dist.csv'
path_to_statement_topics = '/home/dataviz/Downloads/statement_topics_dist2.csv'

#path_to_legislators = '/Users/kevin/Downloads/legislators-current.csv'
#path_to_industries = '/Users/kevin/Downloads/CRPIndustryCodes.csv'
#path_to_tweet_topics = '/Users/kevin/Downloads/tweets_topics_dist.csv'
#path_to_statement_topics = '/Users/kevin/Downloads/statement_topics_dist2.csv'

key = "91a96cc61cceb54c2473df69372795f6" # API key

# twitter keys
consumer_key = "YauX4ahOHAxcsDgcX4zrtkWid"  #same as api key
consumer_secret = "PNezX7Ne2xEAnkomoNBuPw7NWvgQt1w5OvtxTTzgRZZNgSsGRA"  #same as api secret
access_key = "1572984312554786818-eoA2bVWAu0g9FHzhLprwAiOUOwSw5H"
access_secret = "ieTStsQ3LsfFomPAMTEgLjnWU90fODIS543LDvnihfaSn"


#########

# Returns all Republicans sorted by alphabetical order or by total donations
def getAllRepublicans2(sort):
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
    return cid_list
  
# Returns all Democrats sorted by alphabetical order or by total donations
def getAllDemocrats2(sort):
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
    return cid_list

# Returns all Senators sorted by alphabetical order or by total donations
def getAllSenators2(sort):
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

    return cid_list

# Returns all Representatives sorted by alphabetical order or by total donations
def getAllRepresentatives2(sort):
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

    return cid_list

# Returns top 10 industries for a specific candidate cid
def getTopIndustries(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2022&apikey="
    api = endpoint + key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format

        # remove "@" symbols
        data_dict = removeAtSymbol(data_dict) 
        data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]
        return data_dict
    else:
        return f"There's a {response.status_code} error with your request"

# updates a list of dictionaries containing demographic and financial information on congresspeople 
def get_politician_data():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["congresspeople"] # create a new collection in the database
    with open(path_to_legislators, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        column_names = next(csv_reader)
        column_names = column_names[:14] + [column_names[18]] + [column_names[24]] # column names we want
        for row in csv_reader:

            row = row[:14] + [row[18]] + [row[24]]
            new_dict = {}

            # adding info from csv
            for index, var in enumerate(column_names):
                new_dict[var] = row[index]

            # adding summary info from OpenSecrets
            endpoint = "http://www.opensecrets.org/api/?method=candSummary&cid=" + new_dict["opensecrets_id"] + "&cycle=2022&apikey="
            api = endpoint + key
            response = requests.get(f"{api}")
            if response.status_code == 200:
                data_dict = xmltodict.parse(response.text)["response"]["summary"] # parse from XML to a JSON-dict format
                
                # removing @ symbols
                data_dict = removeAtSymbol(data_dict)
                
                # adding to dictionary
                new_dict["first_elected"] = data_dict["first_elected"]
                new_dict["total"] = float(data_dict["total"])
                new_dict["spent"] = float(data_dict["spent"])
                new_dict["cash_on_hand"] = float(data_dict["cash_on_hand"])
                new_dict["debt"] = float(data_dict["debt"])
                new_dict["origin"] = data_dict["origin"]

            # adding industry info from OpenSecrets
            endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + new_dict["opensecrets_id"] + "&cycle=2022&apikey="
            api = endpoint + key
            response = requests.get(f"{api}")
            if response.status_code == 200:
                data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format
                # removing @ symbols
                data_dict = removeAtSymbol(data_dict)
                data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]
                
                # adding to dictionary
                new_dict["industry"] = data_dict["industry"]

            else:
                print(f"There's a {response.status_code} error with your request")
            new_collection.find_one_and_update({"opensecrets_id": new_dict["opensecrets_id"]}, {"$set": new_dict})

# Saves all tweet topic data to our database
def getTweetTopicData():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["tweet_topics"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    with open(path_to_tweet_topics, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        temp = next(csv_reader)
        for row in csv_reader:
            new_dict = {}
            new_dict["doc_id"] = row[1]
            new_dict["opensecrets_id"] = row[4]
            for i in range(5,17):
                topic_num = i - 4
                new_dict["topic_" + str(topic_num)] = row[i]
            new_collection.insert_one(new_dict)


# Saves all statement topic data to our database
def getStatementTopicData():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["statement_topics"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    with open(path_to_statement_topics, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        temp = next(csv_reader)
        for row in csv_reader:
            new_dict = {}
            new_dict["doc_id"] = row[2]
            new_dict["opensecrets_id"] = row[3]
            for i in range(4,29):
                topic_num = i - 3
                new_dict["topic_" + str(topic_num)] = row[i]
            new_collection.insert_one(new_dict)

# saves aggregate data(tweet topics + industry funding) to our database for the following groups: "Republican", "Democrat", "Senator", "Representative"
def saveAggregateData():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection1 = db["aggregate_tweet_topics"] # create a new collection in the database
    new_collection1.drop() # clear anything already in it

    new_collection2 = db["aggregate_industry_data"] # create a new collection in the database
    new_collection2.drop() # clear anything already in it

    new_collection3 = db["aggregate_statement_topics"] # create a new collection in the database
    new_collection3.drop() # clear anything already in it

    groups = ["Republican", "Democrat", "Senator", "Representative"]
    for group in groups:
        if group == "Republican":
            cid_list = getAllRepublicans2("total")
        elif group == "Democrat":
            cid_list = getAllDemocrats2("total")
        elif group == "Senator":
            cid_list = getAllSenators2("total")
        else:
            cid_list = getAllRepresentatives2("total")

        topics_dict = getTweetTopicsDict(cid_list)
        new_collection1.insert_one({"group":group, "tweet_topics": topics_dict})

        industry_data = getIndustryData(cid_list)
        new_collection2.insert_one({"group":group, "industry": industry_data})

        statements_dict = getStatementTopicsDict(cid_list)
        new_collection3.insert_one({"group":group, "statement_topics": statements_dict})

# updates every congressperson's info with their twitter handle 
def getTwitterProfilePics():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    congresspeople = db["congresspeople"] # create a new collection in the database

    for dic in congresspeople.find():
        twitter_handle = dic["twitter"]
        congresspeople.find_one_and_update({"opensecrets_id": dic["opensecrets_id"]}, {"$set": {"profile_pic": getProfilePic(twitter_handle)}})
        
def main():
    get_politician_data() # get all summary information for congresspeople
    #getTweetTopicData() # get topic distribution for all tweets
    #getStatementTopicData() # get topic distribution for all statements
    #saveAggregateData() # calculate and save aggregate topic and industry data for Republican, Democrat, Senator, Representative
    #getTwitterProfilePics() # save all profile pictures 
main()
