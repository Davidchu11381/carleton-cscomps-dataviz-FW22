import csv
import pymongo
import xmltodict
from collections import defaultdict
import requests

path_to_legislators = '/Users/kevin/Downloads/legislators-current.csv'
path_to_industries = '/Users/kevin/Downloads/CRPIndustryCodes.csv'
key = "91a96cc61cceb54c2473df69372795f6" # API key

# returns total donations from specified industry for specified candidate cid
def total_from_industry_by_cid(ind, cid):
        endpoint = "https://www.opensecrets.org/api/?method=candIndByInd&cid=" + cid + "&cycle=2020&ind=" + ind + "&apikey="
        api = endpoint + key
        response = requests.get(f"{api}")
        if response.status_code == 200:
            print("Successfully retrieved total for industry code" + ind +  " for cid: " + cid)
            return response
        else:
            print(
                f"There's a {response.status_code} error with your request")

# saves a list of dictionaries containing demographic information on congresspeople to our database 
def get_politician_data():
    with open(path_to_legislators, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        list_of_dicts = []
        column_names = next(csv_reader)
        column_names = column_names[:14] + [column_names[18]] + [column_names[24]] # column names we want

        for row in csv_reader:
            row = row[:14] + [row[18]] + [row[24]]
            new_dict = {}
            for index, var in enumerate(column_names):
                new_dict[var] = row[index]
            list_of_dicts.append(new_dict)

        # insert into MongoDB database
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = client['comps']
        new_collection = db["congresspeople"] # create a new collection in the database
        new_collection.drop() # clear anything already in it
        new_collection.insert_many(list_of_dicts)

# returns a list of all candidate cid's
def get_all_cid():
    with open(path_to_legislators, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        list_of_cid = []
        temp = next(csv_reader)
        for row in csv_reader:
            list_of_cid.append(row[24])
        return list_of_cid

# returns a list of all industry codes and names in the following format:
# industry code [blank space] industry name
# A01 Banking
def get_all_industries():
    with open(path_to_industries, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        industries_set = set()
        temp = next(csv_reader)
        for row in csv_reader:
            industries_set.add(row[2] + " " + row[3])
        return list(industries_set)

# saves industry donation data to congresspeople (grouped by industry) to our database
def get_industry_totals():
    industry_dict = defaultdict(list)
    cid_list = get_all_cid()
    industry_list = get_all_industries()

    # these are just for demonstrating on a smaller dataset
    # cid_list = cid_list[:5]
    # industry_list = industry_list[:5]

    for industry in industry_list:
        for cid in cid_list:
            response = total_from_industry_by_cid(industry[:3], cid)
            if response:
                data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
                new_cand_dict = {}
                new_cand_dict["cid"] = data_dict["response"]["candIndus"]["@cid"]
                new_cand_dict["name"] = data_dict["response"]["candIndus"]["@cand_name"]
                new_cand_dict["total"] = int(data_dict["response"]["candIndus"]["@total"])
                industry_dict[industry].append(new_cand_dict)

    # insert into MongoDB database
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["industries"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    for industry, congresspeople in industry_dict.items():
        industry_code = industry[:3]
        industry_name = industry[4:]

        new_dict = {"code": industry_code, "name" : industry_name, "congresspeople" : congresspeople}
        new_collection.insert_one(new_dict)

# get_industry_totals()
# get_politician_data()





        
    

