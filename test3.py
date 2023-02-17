import requests
import xmltodict
# removes all "@" symbols from keys in a dictionary
def removeAtSymbol(dict):
    return {x.translate({64:None}) : y for x, y in dict.items()}

key = "91a96cc61cceb54c2473df69372795f6" # API key
endpoint = "https://www.opensecrets.org/api/?method=candIndustry&cid=N00003389&cycle=2022&apikey="
api = endpoint + key
response = requests.get(f"{api}")
print(response.status_code)
if response.status_code == 200:
    data_dict = xmltodict.parse(response.text)["response"]["industries"] # parse from XML to a JSON-dict format
    # removing @ symbols
    data_dict = removeAtSymbol(data_dict)
    data_dict["industry"] = [removeAtSymbol(industry_dict) for industry_dict in data_dict["industry"]]
    print(data_dict["industry"])