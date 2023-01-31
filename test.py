import requests
import json
import xmltodict

# response = requests.get("http://127.0.0.1:5001/topicList")

response = requests.get("http://127.0.0.1:5001/topicList", data=json.dumps({"name": ["foo", "poo", "koo"]}))
print(response.text)
# data_dict = xmltodict.parse(response.text)



