import csv
import pymongo
import xmltodict
import requests
from politicianAPI import removeAtSymbol

path_to_legislators = '/home/dataviz/Downloads/legislators-current.csv'
path_to_industries = '/home/dataviz/Downloads/CRPIndustryCodes.csv'
path_to_tweet_topics = '/home/dataviz/Downloads/tweets_topics_dist.csv'
path_to_statement_topics = '/home/dataviz/Downloads/statement_topics_dist2.csv'

key = "91a96cc61cceb54c2473df69372795f6" # OpenSecrets API key

#########

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

def main():
    get_politician_data() # get all summary information for congresspeople
    getTweetTopicData() # get topic distribution for all tweets
    getStatementTopicData() # get topic distribution for all statements
main()
