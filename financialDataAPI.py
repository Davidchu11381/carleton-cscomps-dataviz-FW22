import requests
import json
import xmltodict
from collections import defaultdict
import pymongo

key = "91a96cc61cceb54c2473df69372795f6"

# returns summary information given a candidate cid
def summary_info_by_cid(cid):
        endpoint = "http://www.opensecrets.org/api/?method=candSummary&cid=" + cid + "&cycle=2020&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            print("Successfully retrieved summary information for cid: ", cid)
            return response
        else:
            print(
                f"There's a {response.status_code} error with your request")

# returns top industry donors by given candidate cid
def top_industries_by_cid(cid):
        endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2020&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            print("Successfully retrieved top industries for cid: ", cid)

            return response
        else:
            print(
                f"There's a {response.status_code} error with your request")

# returns top individual donors by given candidate cid
def top_contributors_by_cid(cid):
        endpoint = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2020&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            print("Successfully retrieved top contributors for cid: ", cid)
            return response
        else:
            print(
                f"There's a {response.status_code} error with your request")

# doesn't seem to work, asking OpenSecrets about it currently
# returns total donations from specified industry for specified candiate cid
def total_from_industry_by_cid(ind, cid):
        #endpoint = "https://www.opensecrets.org/api/?method=candIndByInd&cid=" + cid + "&cycle=2020&ind=" + ind + "&apikey="
        endpoint = "https://www.opensecrets.org/api/?method=candIndByInd&cid=N00007360&cycle=2020&ind=K02&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            print("Successfully retrieved total for industry code " + ind +  "for cid: " + cid)
            return response
        else:
            print(
                f"There's a {response.status_code} error with your request")

# industry_dict is a dict where keys are industry ID's and values are dicts with candidate info
# industry id's -> list containing candidate information
# id_for_oil_industry : 
#                       [{"cid": "N00007360", 
#                         "total": 1231231, 
#                         "name": "Nancy Pelosi"},
#
#                        {"cid": "N00005413", 
#                         "total": 577733, 
#                         "name": "Joe Biden"}]
#
# use heapq.nlargest() to obtain the n candidates with largest totals from a given industry
# heapq.nlargest(n, iterable], key)
# heapq.nlargest(1, industry_dict[industry_id], key = lambda x : x["total"])

def get_industry_totals():
    candidate_list = [] 
    industry_list = []
    industry_dict = defaultdict(float)

    for candidate in candidate_list:
        for industry in industry_list:
            response = total_from_industry_by_cid(industry, candidate)
            # using response, add to industry_dict as appropriate
    # store data in database

# demonstrates how to insert into a MongoDB database
def insert_into_db(data):
    client = pymongo.MongoClient("mongodb://localhost:27017/")

    new_db = client["test_database"] # create a new database
    new_collection = new_db["test_collection"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    list_of_dics = data["response"]["industries"]["industry"]

    x = new_collection.insert_many(list_of_dics) # inserts a list of dictionaries

    for x in new_collection.find():
        print(x)
        print()

def main():
    # demonstrates use of one of the endpoints
    response = top_industries_by_cid("N00007360")
    if response:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
        insert_into_db(data_dict)

    # response = top_industries_by_cid("N00007360")
    # if response:
    #     data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format

    #     print("Candidate name: ", data_dict["response"]["industries"]["@cand_name"])
    #     print("Candidate ID: ", data_dict["response"]["industries"]["@cid"])
    #     print(" \n Top 10 industries + their totals: \n")
    #     for i in range(10):
    #         print(str(i + 1) + ": ")
    #         print(data_dict["response"]["industries"]["industry"][i]["@industry_name"])
    #         print(data_dict["response"]["industries"]["industry"][i]["@total"])
    #         print()

    #     json_data = json.dumps(data_dict)
    #     print(json_data)

    # response = summary_info_by_cid("N00007360")
    # if response:
    #     data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
    #     json_data = json.dumps(data_dict) # convert into text to view 
    #     print(json_data)

    # response = total_from_industry_by_cid("W04", "N00007360")
    # if response:
    #     data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
    #     json_data = json.dumps(data_dict) # convert into text to view 
    #     print(json_data)
main()
