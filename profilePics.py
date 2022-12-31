import tweepy

consumer_key = "YauX4ahOHAxcsDgcX4zrtkWid"  #same as api key
consumer_secret = "PNezX7Ne2xEAnkomoNBuPw7NWvgQt1w5OvtxTTzgRZZNgSsGRA"  #same as api secret
access_key = "1572984312554786818-eoA2bVWAu0g9FHzhLprwAiOUOwSw5H"
access_secret = "ieTStsQ3LsfFomPAMTEgLjnWU90fODIS543LDvnihfaSn"

def getProfilePic(handle):
    # Twitter authentication
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)   
    auth.set_access_token(access_key, access_secret) 
    
    # Creating an API object 
    api = tweepy.API(auth)

    try:
        api.verify_credentials()
        user = api.get_user(screen_name=handle)
        url = user.profile_image_url[:-10]
        url += "bigger.jpg"
        return url
    except:
        print('Failed authentication')


