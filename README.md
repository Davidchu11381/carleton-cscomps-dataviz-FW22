# Is a Dollar Worth a Thousand Words? Visualizing the Connections Between U.S. Congress Members’ Funding and Speech

FollowTheMoney is a web application that enables the exploration of the relationships between funding sources and speech topics for members of the 117th United States Congress. These relationships are visualized in the form of Sankey diagrams, which show the flows of money from donating industries to congresspeople and the flows of speech from congresspeople to topics. FollowTheMoney uses data on campaign funding broken down by industry gathered from OpenSecrets, statements made on the floor of Congress collected from the Congressional Records, and tweets for each congressperson pulled from Twitter. To extract and quantify the topics contained in the statements and tweets, we used a Latent Dirichlet Allocation (LDA) topic model, assigning each document to a particular topic. The hope is that FollowTheMoney's intuitive, simple interface can help a broad audience understand better how campaign contributions influence what politicians talk about.

Users are able to input a arbitrary subset of congresspeople by using the filtering system below:

![alt text](https://github.com/Davidchu11381/carleton-cscomps-dataviz-FW22/blob/master/DemoScreenshots/filter.png)

Upon clicking "Display Visualization(s) Below", three visualizations will be displayed:

1. A Sankey diagram showing the breakdown of the top 10 industries that fund the congressperson(s).

2. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) Tweets.

3. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) congressional statements.

### See examples of those diagrams below for the Democratic Senators of Minnesota(as of March 2023):

![alt text](https://github.com/Davidchu11381/carleton-cscomps-dataviz-FW22/blob/master/DemoScreenshots/funding_sankey.png)
![alt text](https://github.com/Davidchu11381/carleton-cscomps-dataviz-FW22/blob/master/DemoScreenshots/tweets_sankey.png)
![alt text](https://github.com/Davidchu11381/carleton-cscomps-dataviz-FW22/blob/master/DemoScreenshots/statements_sankey.png)
___

## Methods

Funding data was collected from the OpenSecrets API. This data consists of the contributions to each congressperson in the 117th Congress from the top ten contributing industries for that congressperson, based on contributions made in the 2020 election cycle. OpenSecrets groups contributions into 83 industries, and the dollar amounts displayed in our Funding visualization reflect the total contributions from all individuals, corporations, or PACs affiliated with the specified industry to the given congressperson.

Tweet data was collected from the Twitter API. We collected all available Tweets for each congressperson with a public Twitter account in the 117th Congress. To extract the topic categories displayed in our visualizations, we fit a Latent Dirichlet Allocation (LDA) statistical language model to a subset of the Tweets consisting of one hundred randomly selected Tweets for each congressperson. For each Tweet in this subset, the LDA model assigned probabilities that the Tweet was about one of our twelve topics. We labeled the topics by manually examining the tweets that were assigned high probabilities and gleaning their topics. The proportions displayed in the Tweets visualization are calculated as follows:

- For topic X, count the number of Tweets where the highest probability is assigned to topic X and that probability is at least 0.15 (a threshold we set after manually inspecting the coherence of topics with decreasing probability).
- Divide this number by the total number of Tweets that assigned at least 0.15 probability to some topic.

Statement data was collected from the Congressional Record API and consists of statements made by congress people during the 117th Congress on the House or Senate floors. Like the Tweet data, we intuited the statement topics by fitting a LDA model to the statement data; unlike the Tweet data, we categorized the statements into twenty-five topics. We followed the same manual procedure to label the statement topics, and determined a classification threshold of 0.2 using the same inspection procedure we used to find the 0.15 threshold for the Tweet data. The proportions displayed in the Statements visualization are calculated similarly to the proportions in the Tweets visualization.

___

## How to Run

### Get the data 
Run the file "getData.py" by running "python3 getData.py" in the command line within the project directory.

### API
To run the API for this project, run this in the command line within the project directory, remotely on Olin 312-04:

$ export FLASK_APP=politicianAPI.py

$ flask run --host 0.0.0.0 --port 5001

Then, go to your browser and go to http://localhost:5001/ to access the API. 

### Run locally
To run the site locally, run this in the command line within the project directory:

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### Build
To build and run the site, run this in the command line within the project directory:

`npm run build`

`serve -s build`

You can now access the site at the url [followthemoneycomps.com](followthemoneycomps.com).
