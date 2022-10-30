import requests
import json
import xmltodict
from collections import defaultdict

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

# doesn't seem to work
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

# 
def get_industry_totals():
    candidate_list = [] 
    industry_list = []
    industry_dict = defaultdict(float)

    for candidate in candidate_list:
        for industry in industry_list:
            response = total_from_industry_by_cid(industry, candidate)
            # using response, add to industry_dict as appropriate
            # industry_dict[industry] += (number obtained from response)
    # store data in database

def main():
    response = top_industries_by_cid("N00007360")
    if response:
        data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format

        print("Candidate name: ", data_dict["response"]["industries"]["@cand_name"])
        print("Candidate ID: ", data_dict["response"]["industries"]["@cid"])
        print(" \n Top 10 industries + their totals: \n")
        for i in range(10):
            print(str(i + 1) + ": ")
            print(data_dict["response"]["industries"]["industry"][i]["@industry_name"])
            print(data_dict["response"]["industries"]["industry"][i]["@total"])
            print()

        json_data = json.dumps(data_dict)
        print(json_data)

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