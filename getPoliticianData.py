import csv
import pymongo

# gets the following variables for each congressperson in dictionary format and inserts into MongoDB
#   'last_name', 'first_name', 'middle_name', 'suffix', 'nickname', 'full_name', 'birthday', 
#   'gender', 'type', 'state', 'district', 'senate_class', 'party', 'url', 'twitter', 'opensecrets_id'

# QUESTION: what do we want to be in this collection? 
#   For the congresspeople, I'm thinking we only want this basic demographics information. 
# We should retrieve the financial data on the fly using API calls. And then manipulate and display.

#   For the industries, we should store more in the database: top congresspeople the industry 
# contributes to, total contributions, etc.

filename = '/Users/kevin/Downloads/legislators-current.csv'

def getDemographicData():
    with open(filename, 'r') as csvfile:
        csv_reader = csv.reader(csvfile)
        list_of_dicts = []
        column_names = next(csv_reader)
        column_names = column_names[:14] + [column_names[18]] + [column_names[24]] # column names we want
        count = 0

        for row in csv_reader:
            count += 1
            if count > 10:
                break

            row = row[:14] + [row[18]] + [row[24]]
            new_dict = {}
            for index, var in enumerate(column_names):
                new_dict[var] = row[index]
            list_of_dicts.append(new_dict)
        return list_of_dicts

demographic_info = getDemographicData()
client = pymongo.MongoClient("mongodb://localhost:27017/")
new_db = client["test_database"] # create a new database
new_collection = new_db["test_collection"] # create a new collection in the database
new_collection.drop() # clear anything already in it

x = new_collection.insert_many(demographic_info) # inserts a list of dictionaries

for x in new_collection.find():
    print(x)
    print()


        
    

