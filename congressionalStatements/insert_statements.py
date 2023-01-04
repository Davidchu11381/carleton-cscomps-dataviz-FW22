import datetime
import sys
import requests

import pymongo
import pandas as pd

from parse_pdf import *

def get_cr_data():
    return pd.DataFrame.from_pickle("../CR_API/cr_117")

def addCongressRecordId(collection):
    stateDict = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

    # test adding congress_record_id field

    for doc in collection.find():
        lastName = doc['last_name']
        stateCode = doc['state']
        fullState = stateDict[stateCode]
        if collection.count_documents({'last_name' : lastName, 'type' : doc['type']}) > 1: #if ambiguous last name
            congressRecordID = lastName.upper() + " of " + fullState
        else:
            congressRecordID = lastName.upper()
        
        collection.update_one(
            {"_id" : doc["_id"]}, 
            {"$set": {"congress_record_id": congressRecordID}})

def store_speeches(speech_list, collection, date):
    # store in a mongodb collection
    for speech in speech_list:
        cm_id = getCMIDFromSpeech(speech)
        # speech = re.sub('(?:Mr|Ms|Mrs). ' + memberName, '', speech) # filter out names at beginning  

        # if document already exists, update
        if collection.count_documents({"cm_id": cm_id, "date" : date}) > 0:
            collection.find_one_and_update(
                {"cm_id": cm_id, "date" : date},
                {"$push": {"statements" : speech}})
        else:
            document = {
                "cm_id" : cm_id,
                "date" : date,
                "statements" : [speech]
            }
            collection.insert_one(document)

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
    addCongressRecordId(congresspeople_collection)

    try: 
        df = pd.from_pickle(argv[0])
    except FileNotFoundError as e:
        print(e)
    except IndexError as e:
        print(e)

    #test_pdf = 'https://www.congress.gov/117/crec/2021/01/28/167/17/CREC-2021-01-28-senate.pdf'
    #date = datetime.date(2021,1,28)
    for row in df.itertuples():
        pdf_text = load_pdf(row.pdf_url)
        date = row.date.date()
        speeches = extract_speeches(pdf_text, date, row.chamber)
        store_speeches(speeches, statements_collection, date)
    check_collection(statements_collection)

if __name__ == "__main__":
    main()