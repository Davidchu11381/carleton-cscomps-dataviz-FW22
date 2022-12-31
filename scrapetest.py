import requests
from bs4 import BeautifulSoup
import re

def remove_tags(text):
    text = re.sub('<[^>]*>', '', text)
    last_period_index = text.rfind('.')
    if last_period_index != -1:
        text = text[:last_period_index+1] + '\n' + text[last_period_index+1:]
    
    last_updated_index = text.rfind('Updated')
    if last_updated_index != -1:
        text = text[:last_updated_index] + '\n' + text[last_updated_index:]

    return text

def getDescription(ind):
    url = "https://www.opensecrets.org/industries/background.php?cycle=2022&ind=" + ind
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    results = soup.find(id="profileLeftColumn")
    results = remove_tags(results.text)
    return results

getDescription("D01")