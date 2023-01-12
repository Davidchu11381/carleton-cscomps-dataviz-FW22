import pymongo
import random

client = pymongo.MongoClient("mongodb://localhost:27017/") # must be run on olin312-04
db = client["comps"]
congresspeople_collection = db["congresspeople"]
topics_collection = db["statement_topics"]

random_words = ["abortion", "government", "business", "capitalism", "Biden", "president", "guns", "violence", "crime", "rights", "freedom", "immigration", "health", "insurance", "covid", "aid", "vaccines", "women's rights", "policy", "labor", "covid", "Trump", "DACA", "climate change", "environment", "police", "minimum wage", "America", "Russia", "election", "economy"]

for doc in congresspeople_collection.find():
    num_words = random.randint(2, 6)
    topic_frequencies = {}
    for i in range(num_words):
        frequency = random.random()
        topic = random_words[random.randint(0,30)]
        topic_frequencies[topic] = frequency
    
    new_doc = {
        "opensecrets_id" : doc["opensecrets_id"],
        "topic_frequencies" : topic_frequencies
    }
    topics_collection.insert_one(new_doc)
