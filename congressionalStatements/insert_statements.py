import datetime
import sys
import requests

import pymongo
import pandas as pd

from parse_pdf import *

def get_cr_data():
    return pd.DataFrame.from_pickle("../CR_API/cr_117")

def add_congress_record_id(collection):
    state_dict = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

    # need to fix this to include ppl with same name and same state
    # test adding congress_record_id field

    for doc in collection.find():
        try:
            last_name = doc['last_name']
            state_code = doc['state']
            state = state_dict[state_code]
            # if same last name, chamber, state, and sex (?), include full name -- may need to double check this, could be an issue tho
            if collection.count_documents({'last_name' : last_name, 'type' : doc['type'], 'gender' : doc['gender'], 'state' : state_code}) > 1 :
                congress_record_id = doc['first_name'].upper() + " " + last_name.upper() + " of " + state
            elif collection.count_documents({'last_name' : last_name, 'type' : doc['type']}) > 1: #if ambiguous last name
                congress_record_id = last_name.upper() + " of " + state
            else:
                congress_record_id = last_name.upper()
            
            collection.update_one(
                {"_id" : doc["_id"]}, 
                {"$set": {"congress_record_id": congress_record_id}})
        except KeyError:
            pass

def store_speeches(speech_list, statements_collection, congresspeople_collection, date):
    # store in a mongodb collection
    date = str(date)
    for speech in speech_list:
        opensecrets_id = get_id_from_speech(speech, congresspeople_collection)
        # speech = re.sub('(?:Mr|Ms|Mrs). ' + memberName, '', speech) # filter out names at beginning  

        # if document already exists, update
        if statements_collection.count_documents({"opensecrets_id": opensecrets_id, "date" : date}) > 0:
            statements_collection.find_one_and_update(
                {"opensecrets_id": opensecrets_id, "date" : date},
                {"$push": {"statements" : speech}})
        else:
            document = {
                "opensecrets_id" : opensecrets_id,
                "date" : date,
                "statements" : [speech]
            }
            statements_collection.insert_one(document)

def check_collection(collection):
    # test contents of collection -- good so far!!
    for doc in collection.find():
        print("NEW DOC")
        print(doc)

def get_mongodb_client():
    client = pymongo.MongoClient("mongodb://localhost:27017/") # must be run on olin312-04!!
    db = client["comps"] # access the comps db
    return db

def get_statements_collection(db):
    collection = db["statements"]
    return collection

def get_congresspeople_collection(db):
    collection = db["congresspeople"]
    return collection

def main(argv):
    db = get_mongodb_client()
    statements_collection = get_statements_collection(db)
    congresspeople_collection = get_congresspeople_collection(db)
    add_congress_record_id(congresspeople_collection)
    #check_collection(congresspeople_collection)

    try: 
        df = pd.read_pickle(argv[0])
    except FileNotFoundError as e:
        print(e)
    except IndexError as e:
        print(e)

    #test_pdf = 'https://www.congress.gov/117/crec/2021/01/28/167/17/CREC-2021-01-28-senate.pdf'
    #date = datetime.date(2021,1,28)
    num = 0 # progress counter
    for row in df.itertuples():
        if num % 10 == 0:
            print(num)
        with open("temp.pdf", "wb") as pdf:
            pdf.write(requests.get(row.pdf_url).content)
        pdf_text = load_pdf("temp.pdf")
        date = row.date.date()
        speeches = extract_speeches(pdf_text, date, row.chamber, congresspeople_collection)
        store_speeches(speeches, statements_collection, congresspeople_collection, date)
    check_collection(statements_collection)

if __name__ == "__main__":
    main(sys.argv[1:])