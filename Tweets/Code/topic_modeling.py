# Topic modeling for Tweets
# David Chu
# November 2022

# Import libraries
#Base and Cleaning 
import pandas as pd
import numpy as np
import emoji
import re
import os
import time

#Natural Language Processing (NLP)
import spacy
import gensim
from spacy.tokenizer import Tokenizer
from gensim.corpora import Dictionary
from gensim.models.ldamulticore import LdaMulticore
from gensim.models.coherencemodel import CoherenceModel
from gensim.parsing.preprocessing import STOPWORDS as SW
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import GridSearchCV
from pprint import pprint
from wordcloud import STOPWORDS
stopwords = set(STOPWORDS)
import tweepy

nlp = spacy.load('en_core_web_lg')

def get_tweets(name):
    '''
    get Tweets from a Twitter username
    '''
    # API keys
    consumer_key = "cC3xjsO0yoo12iaxDXXO2C9XG" 
    consumer_secret = "9CK4KWCqcBlvcPBgkJ6EY78VTDzwUjdwtJbTD10CWFjSJ8p6kk"  #same as api secret
    access_key = "1572984312554786818-wINhA428AvCReSw2BWIhgTAK4orJHs"
    access_secret = "UsU84LHeQ0ny5gddq8DvyqsSWUnWr9CkSRcoUiEsaA8ut"

    # Twitter authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
    auth.set_access_token(access_key, access_secret) 
  
    # Creating an API object 
    api = tweepy.API(auth)
    id = name
    new_tweets = tweepy.Cursor(api.user_timeline, 
                           screen_name=id, 
                           tweet_mode='extended',
                           include_rts=False).items()
    list = []
    for tweet in new_tweets:
        text = tweet._json["full_text"]
        refined_tweet = {'text' : text,
                    'favorite_count' : tweet.favorite_count,
                    'retweet_count' : tweet.retweet_count,
                    'created_at' : tweet.created_at}
        list.append(refined_tweet)

    df = pd.DataFrame(list)
    return df

def give_emoji_free_text(text):
    """
    Removes emoji's from tweets
    Accepts:
        Text (tweets)
    Returns:
        Text (emoji free tweets)
    """
    emoji_list = [c for c in text if c in emoji.UNICODE_EMOJI]
    clean_text = ' '.join([str for str in text.split() if not any(i in str for i in emoji_list)])
    return clean_text

def url_free_text(text):
    '''
    Cleans text from urls
    '''
    text = re.sub(r'http\S+', '', text)
    return text

def get_lemmas(text):
        '''Used to lemmatize the processed tweets'''
        lemmas = []
        
        doc = nlp(text)
        
        # Something goes here :P
        for token in doc: 
            if ((token.is_stop == False) and (token.is_punct == False)) and (token.pos_ != 'PRON'):
                lemmas.append(token.lemma_)
        
        return lemmas

def tokenize(text):
        """
        Parses a string into a list of semantic units (words)
        Args:
            text (str): The string that the function will tokenize.
        Returns:
            list: tokens parsed out
        """
        # removing hashtags and mentions
        tokens = re.sub(r"@[A-Za-z0-9_]+","", text)
        tokens = re.sub(r"#[A-Za-z0-9_]+","", tokens)
        # removing numbers
        tokens = re.sub(r"\b\d+\b","", tokens)
        # removing &amp
        tokens = re.sub(r"&amp|amp", "", tokens)
        # removing urls
        tokens = re.sub(r"http\S+", "", tokens)
        tokens = re.sub(r"www.\S+", "", tokens)
        # removing punctuations 
        tokens = re.sub(r'[()!?]', ' ', tokens)
        tokens = re.sub(r'\[.*?\]',' ', tokens)
        # removing non-alphanumeric characters
        tokens = re.sub(r'\W+',' ', tokens)
        # make text lowercase and split it
        tokens = tokens.lower().split() 
        # removing stop words
        stop_words = open("./data/stopwords.txt",'r').read().splitlines()
        stop_words = [word.strip() for word in stop_words]
        tokens = [w for w in tokens if not w in stop_words]

        return tokens

def get_topics(df):
    '''
    get topics from list of documents
    '''
    #Create a new column with url free tweets
    df['url_free_tweets'] = df['text'].apply(url_free_text)
    # Tokenizer
    tokenizer = Tokenizer(nlp.vocab)
    # Custom stopwords
    custom_stopwords = ['hi','\n','\n\n', '&', ' ', '.', '-', 'got', "it's", 'it’s', "i'm", 'i’m', 'im', 'want', 'like', '$', '@']
    # Customize stop words by adding to the default list
    STOP_WORDS = nlp.Defaults.stop_words.union(custom_stopwords)
    # ALL_STOP_WORDS = spacy + gensim + wordcloud
    ALL_STOP_WORDS = STOP_WORDS.union(SW).union(stopwords)
    tokens = []
    for doc in tokenizer.pipe(df['url_free_tweets'], batch_size=500):
        doc_tokens = []    
        for token in doc: 
            if token.text.lower() not in ALL_STOP_WORDS:
                doc_tokens.append(token.text.lower())   
        tokens.append(doc_tokens)

    # Makes tokens column
    df['tokens'] = tokens
    # Make tokens a string again
    df['tokens_back_to_text'] = [' '.join(map(str, l)) for l in df['tokens']]
    df['lemmas'] = df['tokens_back_to_text'].apply(get_lemmas)
    # Make lemmas a string again
    df['lemmas_back_to_text'] = [' '.join(map(str, l)) for l in df['lemmas']]
    # Apply tokenizer
    df['lemma_tokens'] = df['lemmas_back_to_text'].apply(tokenize)

    # Create a id2word dictionary
    id2word = Dictionary(df['lemma_tokens'])
    print(len(id2word))
    # Filtering Extremes
    id2word.filter_extremes(no_below=2, no_above=.99)
    print(len(id2word))
    # Creating a corpus object 
    corpus = [id2word.doc2bow(d) for d in df['lemma_tokens']]
    # Instantiating a Base LDA model 
    base_model = LdaMulticore(corpus=corpus, 
                            num_topics=10, 
                            id2word=id2word, 
                            workers=12, 
                            passes=5, 
                            decay = 0.7)

    # get top topics
    topics = base_model.top_topics(corpus)
    top_topics = [topics[i][0][0][1] for i in range(len(topics))]
    top_unique_topics = np.unique(top_topics)
    return top_unique_topics

def build_database(df):
    df = df[['last_name', 'first_name', 'opensecrets_id', 'twitter']].astype(str)
    tweets_list = []
    topics_list = []
    k = 0
    while(k < len(df)/5):
        for i in range(5*k, 5*(k+1)):
            id = df['twitter'][i]
            if id != 'nan':
                # return all tweets
                tweets = get_tweets(id)[['text','created_at']]
                tweets['opensecrets_id'] = df['opensecrets_id'][i]
                tweets['twitter'] = df['twitter'][i]
                tweets_list.append(tweets)

                # return topics
                topics = ' '.join(get_topics(tweets))
                topics_list.append(topics)
            else:
                topics_list.append('NaN')
        k += 1
        time.sleep(15*60)

        all_tweets = pd.concat(tweets_list)
        all_tweets.to_csv('./data/all_tweets/all_tweets.csv')
        df['topics'] = topics_list
        # topics_df = pd.DataFrame (topics_list, columns = ['topics'])
        df.to_csv('./data/all_topics/all_topics.csv')

if __name__ == "__main__":
    os.chdir('/Users/davidchu/Desktop/Carleton/Courses/Senior/Fall/CS Comps/carleton-cscomps-dataviz-FW22/Tweets')
    df = pd.read_csv("./data/legislators-current.csv")
    build_database(df)