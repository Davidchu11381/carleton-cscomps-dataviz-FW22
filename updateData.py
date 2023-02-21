import pymongo
from collections import defaultdict
import requests
import xmltodict

key = "91a96cc61cceb54c2473df69372795f6" # API key

# removes all "@" symbols from keys in a dictionary
def removeAtSymbol(dict):
    return {x.translate({64:None}) : y for x, y in dict.items()}

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['comps']
congresspeople = db["congresspeople"] # create a new collection in the database

for dic in congresspeople.find():
    try:
        temp = dic["industry"]
    except KeyError:
        cid = dic["opensecrets_id"]
        print("getting info for cid: ", cid)
        endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2020&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format
            # removing @ symbols
            data_dict = removeAtSymbol(data_dict)
            data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]
            
            # adding to dictionary
            congresspeople.find_one_and_update({"opensecrets_id": cid}, {"$set": {"industry": data_dict["industry"]}})

        else:
            print(f"There's a {response.status_code} error with your request")