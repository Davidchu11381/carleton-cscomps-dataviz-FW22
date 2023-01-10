import re
import datetime
import PyPDF2
import pymongo

# get text of pdf as one long string
def load_pdf(pdf_file):
    with open(pdf_file, 'rb') as f:
        pdf_reader = PyPDF2.PdfFileReader(f)
        pdf_text = ''
        for i in range(pdf_reader.numPages):
            pdf_text += pdf_reader.getPage(i).extractText()
    return pdf_text

#regex variables
#memberName = '[A-Z][A-Z]+(?:[ -][A-Z][A-Z]+)?' # this is temp, will update with a function to get more like the one below # [A-Z][A-Z]+ -- old one
date = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) [0-9]{1,2}, [0-9]{4}'
states = 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'

# from congresspeople_collection, make a regex for congress_record_ids
def get_congress_record_id_regex(congresspeople_collection):
    ids = []
    for doc in congresspeople_collection.find():
        try:
            ids.append(doc['congress_record_id'])
        except KeyError:
            # filter out members in collection not from a state
            pass
    return '|'.join(ids) 

# identify author of speech and return corresponding opensecrets_id
def get_id_from_speech(speech, congresspeople_collection):
    member_ids = get_congress_record_id_regex(congresspeople_collection)
    congressperson_id = re.search(member_ids, speech).group(0) 
    try:
        opensecrets_id = congresspeople_collection.find_one({"congress_record_id" : congressperson_id})['opensecrets_id'] #using opensecrets_id for now, may change
        return opensecrets_id
    except TypeError as e:
        # debugging code
        with open('bugged_speech.txt', 'w') as f:
            f.write(speech)
        print(congressperson_id)
        raise e

# extract a list of all speeches from pdf text
def extract_speeches(pdf_text, date, chamber, congresspeople_collection):
    year = date.year
    # handle newlines, mark end of speeches with ~
    pdf_text = re.sub('-|\n', '' ,pdf_text)
    pdf_text = re.sub('\nf ', '~', pdf_text) 
    pdf_text = re.sub('VerDate(?:.*?)RECORD(?:.*?)' + str(year), '', pdf_text) #test this?
    pdf_text = re.sub('The (?:ACTING )?(?:PRESIDENT|SPEAKER) pro tempore|The PRESIDING OFFICER', '~', pdf_text) 
    
    # regex variables
    member_ids = get_congress_record_id_regex(congresspeople_collection)
    stopper = '(?:(?:Mr|Ms|Mrs)\. (?:' + member_ids + ')\.|~)'
    regex = '((?:Mr|Ms|Mrs)\. (?:' + member_ids + ')\. (?:.*?))' + stopper 
    all_speeches = re.findall(regex, pdf_text)

    return all_speeches
