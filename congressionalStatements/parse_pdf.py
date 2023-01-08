import re
import datetime

import PyPDF2
import pymongo


def load_pdf(pdf_file):
    with open(pdf_file, 'rb') as f:
    #pdfFile = open('/Users/annaneiman-golden/Downloads/CREC-2021-03-23-senate.pdf', 'rb')
        pdf_reader = PyPDF2.PdfFileReader(f)
        # Read in pages, concat into one long string
        pdf_text = ''
        for i in range(pdf_reader.numPages):
            pdf_text += pdf_reader.getPage(i).extractText()
    return pdf_text

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
    for doc in collection.find():
        try:
            ids.append(doc['congress_record_id'])
        except KeyError:
            # not from a state - will filter these members out
            pass
    return '|'.join(ids) 

# def getDateAndChamber(pdfName):
#     '''
#     get date and chamber from input (paired with links)
#     '''
#     date = re.search('[0-9]{4}-[0-9]{2}-[0-9]{2}', pdfName).group()
#     # chamber = re.search('senate|house', pdfName).group() -- when using chamber specific docs
#     chamber = ""
#     return date, chamber

# helper methods to get opensecrets id from speech
def get_id_from_speech(speech, congressperson_collection):
    member_ids = get_congress_record_id_regex(congressperson_collection)
    #congressperson_id = re.search('(?:Mr|Ms|Mrs). (' + member_ids + ')', speech).group(0) #changed here to group -- works?
    congressperson_id = re.search(member_ids, speech).group(0) # if not, try this

    try:
        opensecrets_id = congressperson_collection.find_one({"congress_record_id" : congressperson_id})['opensecrets_id'] #using opensecrets_id for now, may change
        return opensecrets_id
    except TypeError as e:
        with open('bugged_speech.txt', 'w') as f:
            f.write(speech)
        print(congressperson_id)
        raise e

def extract_speeches(pdf_text, date, chamber, congressperson_collection):
    # Prepare pdf text to be parsed for speeches
    # handle newlines
    pdf_text = re.sub('-|\n', '' ,pdf_text)
    pdf_text = re.sub('\nf ', '~', pdf_text) #marking the end of a speech
    year = date.year

    #print(re.search('VerDate(.*?)'+year, pdf_text).group()) # no <3
    pdf_text = re.sub('VerDate(?:.*?)RECORD(?:.*?)' + str(year), '', pdf_text) #test this
    #VerDate.*year
    #pdf_text = re.sub('The SPEAKER pro tempore', '~', pdf_text)
    pdf_text = re.sub('The (?:ACTING )?(?:PRESIDENT|SPEAKER) pro tempore|The PRESIDING OFFICER', '~', pdf_text) #marking the end of a speech
    #regex variables

    member_ids = get_congress_record_id_regex(congressperson_collection)
    date = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) [0-9]{1,2}, [0-9]{4}'
    states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'

    # find all speeches
    # print("-----")
    # print(member_ids)
    # print("-----")

    stopper = '(?:(?:Mr|Ms|Mrs)\. (?:' + member_ids + ')\.|~)'
    #regex = '(?:Mr|Ms|Mrs)\. (?:' + member_ids + ')\. [^~]*' # could def make this better, but works ok!
    regex = '((?:Mr|Ms|Mrs)\. (?:' + member_ids + ')\. (?:.*?))' + stopper #adding this, lets see if it works
    #regex = '('+memberID + '(?: of ' + states + ')?\. (?:.*?))(?:~|'+memberID+'\.)'
    all_speeches = re.findall(regex, pdf_text)

    # should output list of all speeches in the given pdf
    # for speech in all_speeches:
    #     print("NEXT SPEECH--------")
    #     print(speech)
    return all_speeches

# could prob do more filtering like the speech filter

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

