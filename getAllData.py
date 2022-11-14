import csv
import pymongo
import json
import xmltodict
from financialDataAPI import total_from_industry_by_cid
import pandas as pd
from collections import defaultdict
import heapq


# gets the following variables for each congressperson in dictionary format and inserts into MongoDB
#   'last_name', 'first_name', 'middle_name', 'suffix', 'nickname', 'full_name', 'birthday', 
#   'gender', 'type', 'state', 'district', 'senate_class', 'party', 'url', 'twitter', 'opensecrets_id'

path_to_legislators = '/Users/kevin/Downloads/legislators-current.csv'
path_to_industries = '/Users/kevin/Downloads/CRPIndustryCodes.csv'

# returns a list of dictionaries containing all information on congresspeople
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
        return list_of_dicts

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

get_all_industries()

def get_industry_totals():
    industry_dict = defaultdict(list)
    cid_list = get_all_cid()
    industry_list = get_all_industries()

    # these are just for demonstrating on a smaller dataset
    cid_list = cid_list[:5]
    industry_list = industry_list[:5]

    test = "" # just used to demonstrate 
    for industry in industry_list:
        for cid in cid_list:
            response = total_from_industry_by_cid(industry[:4], cid)
            if response:
                test = industry
                data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
                new_cand_dict = {}
                new_cand_dict["cid"] = data_dict["response"]["candIndus"]["@cid"]
                new_cand_dict["name"] = data_dict["response"]["candIndus"]["@cand_name"]
                new_cand_dict["total"] = data_dict["response"]["candIndus"]["@total"]
                industry_dict[industry].append(new_cand_dict)

    print("industry_dict[" + test + "]: ", industry_dict[test])
    print()
    print(heapq.nlargest(2, industry_dict[test], key = lambda x : x['total']))

get_industry_totals()

def top_k_by_industry(industry, k):
    industry_dict = get_industry_totals() # we will query MongoDB instead of calling this
    return (heapq.nlargest(k, industry_dict[industry], key = lambda x : x['total']))

# insert into MongoDB database

# client = pymongo.MongoClient("mongodb://localhost:27017/")
# new_db = client["test_database"] # create a new database
# new_collection = new_db["test_collection"] # create a new collection in the database
# new_collection.drop() # clear anything already in it

# x = new_collection.insert_many(demographic_info) # inserts a list of dictionaries

# for x in new_collection.find():
#     print(x)
#     print()


        
    

