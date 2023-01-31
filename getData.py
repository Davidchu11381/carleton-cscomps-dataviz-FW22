import csv
import pymongo
import xmltodict
from collections import defaultdict
import requests
import time
from politicianAPI import removeAtSymbol

path_to_legislators = '/home/dataviz/Downloads/legislators-current.csv'
# path_to_industries = '/home/dataviz/Downloads/CRPIndustryCodes.csv'
# path_to_topics = '/home/dataviz/Downloads/topic_dist_by_doc.csv'

#path_to_legislators = '/Users/kevin/Downloads/legislators-current.csv'
#path_to_industries = '/Users/kevin/Downloads/CRPIndustryCodes.csv'
#path_to_topics = '/Users/kevin/Downloads/topic_dist_by_doc.csv'

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

# Returns top 10 industries for a specific candidate cid
def getTopIndustries(cid):
    endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=" + cid + "&cycle=2022&apikey="
    api = endpoint + opensecrets_key
    response = requests.get(f"{api}")
    if response.status_code == 200:
        data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format

        # remove "@" symbols
        data_dict = removeAtSymbol(data_dict) 
        data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]
        return data_dict
    else:
        return f"There's a {response.status_code} error with your request"

# saves a list of dictionaries containing demographic and financial information on congresspeople to our database 
def get_politician_data2():
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

# saves a list of dictionaries containing demographic and financial information on congresspeople to our database 
def get_politician_data():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["congresspeople"] # create a new collection in the database
    # new_collection.drop() # clear anything already in it
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
            new_collection.insert_one(new_dict)

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
# takes ~ 4 days to completely run.
# DO NOT RUN UNLESS YOU KNOW WHAT YOU'RE DOING. It will clear everything in our database and will take days to rerun it.
def get_industry_data():
    industry_dict = defaultdict(list)
    cid_list = get_all_cid()
    industry_list = get_all_industries()

    cid_list = cid_list[:5]
    industry_list = industry_list[:5]

    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["industries"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    count = 0 # counts number of calls we have made in order to make sure we don't exceed 20000 calls per day
    for industry in industry_list:
        total = 0 # keeps track of total amount of donations from this industry
        for cid in cid_list:
            response = total_from_industry_by_cid(industry[:3], cid)
            count += 1
            print(count)
            if count > 15000:
                count = 0
                time.sleep(90000)
            if response:    
                data_dict = xmltodict.parse(response.text) # parse from XML to a JSON-dict format
                new_cand_dict = {}
                new_cand_dict["cid"] = data_dict["response"]["candIndus"]["@cid"]
                new_cand_dict["name"] = data_dict["response"]["candIndus"]["@cand_name"]
                donation_amount = int(data_dict["response"]["candIndus"]["@total"])
                new_cand_dict["total"] = donation_amount
                total += donation_amount # updates total amount of donations
                industry_dict[industry].append(new_cand_dict) # adds this candidate's info to the list 

        new_dict = {"code": industry[:3], "name" : industry[4:], "total": total, "congresspeople" : industry_dict[industry]}
        new_collection.insert_one(new_dict)

# Saves tweet topic data to our database
def getTopicData():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['comps']
    new_collection = db["topics"] # create a new collection in the database
    new_collection.drop() # clear anything already in it

    with open(path_to_topics, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        temp = next(csv_reader)
        for row in csv_reader:
            new_dict = {}
            new_dict["doc_id"] = row[1]
            new_dict["created_at"] = row[2]
            new_dict["opensecrets_id"] = row[3]
            new_dict["twitter"] = row[4]
            for i in range(5,17):
                new_dict["topic_" + str(i - 4)] = row[i]
            new_collection.insert_one(new_dict)
get_politician_data2()

        






        
    

