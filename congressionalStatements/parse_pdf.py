import PyPDF2
import re
import pymongo
import datetime


def load_pdf(pdf_file):
    with open(pdf_file, 'rb') as f:
    #pdfFile = open('/Users/annaneiman-golden/Downloads/CREC-2021-03-23-senate.pdf', 'rb')
        pdfReader = PyPDF2.PdfFileReader(f)
    # Read in pages, concat into one long string
    pdfText = ''
    for i in range(pdfReader.numPages):
        pdfText += pdfReader.getPage(i).extractText()
    return pdfText

# client = pymongo.MongoClient("mongodb+srv://neimana:earthsayshello@cluster0.pvfbgyu.mongodb.net/?retryWrites=true&w=majority")
# db = client['statements_database']
# statementCollection = db['statements']
# statementCollection.drop()
#congressCollection = db['test for now']

#regex variables
#memberName = '[A-Z][A-Z]+(?:[ -][A-Z][A-Z]+)?' # this is temp, will update with a function to get more like the one below # [A-Z][A-Z]+ -- old one
date = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) [0-9]{1,2}, [0-9]{4}'
states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'

# from congress collection, make a regex for all members of congress names -- or congress ID?
def get_congress_record_id_regex(collection):
    ids = []
    for doc in collection:
        ids.append(doc['congress_record_id'])
    return '|'.join(ids) 

def getDateAndChamber(pdfName):
    '''
    get date and chamber from input (paired with links)
    '''
    date = re.search('[0-9]{4}-[0-9]{2}-[0-9]{2}', pdfName).group()
    # chamber = re.search('senate|house', pdfName).group() -- when using chamber specific docs
    chamber = ""
    return date, chamber

# helper methods to get congressmember and date from speech
def get_cmid_from_speech(speech, congressperson_collection):
    member_ids = get_congress_record_id_regex(congressperson_collection)
    congressperson_id = re.search('(?:Mr|Ms|Mrs). ' + member_ids, speech).group(0)
    cm_id = collection.find_one({"congress_record_id" : congressperson_id})['opensecrets_id'] #using opensecrets_id for now, may change

    return cm_id

def extract_speeches(pdf_text, date, chamber, congressperson_collection):
    # Prepare pdf text to be parsed for speeches
    # handle newlines
    pdfText = re.sub('-\n', '' ,pdfText)
    pdfText = re.sub('\nf ', '~', pdfText) #marking the end of a speech
    pdfText = re.sub('\n', '' , pdfText)
    year = date.year

    #print(re.search('VerDate(.*?)'+year, pdfText).group()) # no <3
    pdfText = re.sub('VerDate(.*?)RECORD(.*?)' + year, '', pdfText) #idk if this works no it doesn't
    #VerDate.*year
    #pdfText = re.sub('The SPEAKER pro tempore', '~', pdfText)
    pdfText = re.sub('The (?:ACTING )?(?:PRESIDENT|SPEAKER) pro tempore', '~', pdfText) #marking the end of a speech
    #regex variables

    member_ids = get_congress_record_id_regex(congressperson_collection)
    date = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) [0-9]{1,2}, [0-9]{4}'
    states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'

    # find all speeches
    regex = '(?:Mr|Ms|Mrs)\. ' + member_ids + '\. [^~]*' # could def make this better, but works ok!
    #regex = '((?:Mr|Ms|Mrs). ' + memberName + '(?: of ' + states + ')? .*?)(?:Mr|Ms|Mrs). ' + memberName + '(?: of ' + states + ')?'
    allSpeeches = re.findall(regex, pdfText)

    # should output list of all speeches in the given pdf
    for speech in allSpeeches:
        print("NEXT SPEECH--------")
        print(speech)
    return allSpeeches

def store_speeches(speech_list, statements_collection, congressperson_collection, date):
    # store in a mongodb collection
    for speech in speech_list:
        cm_id = get_cmid_from_speech(speech, congressperson_collection)
        # speech = re.sub('(?:Mr|Ms|Mrs). ' + memberName, '', speech) # filter out names at beginning  

        # if document already exists, update
        if statements_collection.count_documents({"cm_id": cm_id, "date" : date}) > 0:
            statements_collection.find_one_and_update(
                {"cm_id": cm_id, "date" : date},
                {"$push": {"statements" : speech}})
        else:
            document = {
                "cm_id" : cm_id,
                "date" : date,
                "statements" : [speech]
            }
            statements_collection.insert_one(document)

# could prob do more filtering like the speech filter

def check_collection(collection):
    # test contents of collection -- good so far!!
    for doc in collection.find():
        print("NEW DOC")
        print(doc)


# %% [markdown]
# Issues to work out:
# Still getting "CONGRESSIONAL RECORD" and some other stuff as members
# Idea: make a regex of all member names using the group congress collection -- i think this will be good to have, even if it is maybe a bit less efficient it will avoid these errors 
# 
# To do:
# - connect to server db
#     - add code to read thru multiple pdfs from the db
# - integrate congress member collection
#     - make function to get regex of all members names
#     - update get cmid function (what actual id are we using?)
# - try on other pdfs, including ones w/o speeches! **** make changes *here*
# - better parsing for speeches themselves -- improved getting the speaker "tags", now need to improve getting speeches themselves 
# - better parsing on initial pdf
# - figure out what kind of filtering to implement
# - potentially rewrite whole thing as a script (more typical python)
# 
# 

