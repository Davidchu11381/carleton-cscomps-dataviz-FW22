# Is a Dollar Worth a Thousand Words? Visualizing the Connections Between U.S. Congress Members’ Funding and Speech

FollowTheMoney is a web application that enables exploration of the relationships between funding sources and speech topics for members of the 117th United States Congress. These relationships are visualized in the form of Sankey diagrams, which the flows of money from donating industries to congresspeople and the flows of speech from congress people to topics. FollowTheMoney uses data on campaign funding broken down by industry gathered from OpenSecrets, statements made on the floor of Congress collected from the Congressional Records, and tweets for each congress person pulled from Twitter. To extract and quantify the topics contained in the statements and tweets, we used a Latent Dirichlet Allocation (LDA) topic model, assigning each document to a particular topic. We hope that FollowTheMoney's intuitive, simple interface can help a broad audience understand better how campaign contributions influence what politicians talk about.

Users are able to input a arbitrary subset of congresspeople and then three visualizations will be displayed:

1. A Sankey diagram showing the breakdown of the top 10 industries that fund the congressperson(s).

2. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) Tweets.

3. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) congressional statements.

___

## Methods

Funding data was collected from the OpenSecrets API. This data consists of the contributions to each congressperson in the 117th Congress from the top ten contributing industries for that congressperson, based on contributions made in the 2020 election cycle. OpenSecrets groups contributions into 83 industries, and the dollar amounts displayed in our Funding visualization reflect the total contributions from all individuals, corporations, or PACs affiliated with the specified industry to the given congressperson.

Tweet data was collected from the Twitter API. We collected all available Tweets for each congressperson with a public Twitter account in the 117th Congress. To extract the topic categories displayed in our visualizations, we fit a Latent Dirichlet Allocation (LDA) statistical language model to a subset of the Tweets consisting of one hundred randomly selected Tweets for each congressperson. For each Tweet in this subset, the LDA model assigned probabilities that the Tweet was about one of our twelve topics. We labeled the topics by manually examining the tweets that were assigned high probabilities and gleaning their topics. The proportions displayed in the Tweets visualization are calculated as follows:

- For topic X, count the number of Tweets where the highest probability is assigned to topic X and that probability is at least 0.15 (a threshold we set after manually inspecting the coherence of topics with decreasing probability).
- Divide this number by the total number of Tweets that assigned at least 0.15 probability to some topic.

Statement data was collected from the Congressional Record API and consists of statements made by congress people during the 117th Congress on the House or Senate floors. Like the Tweet data, we intuited the statement topics by fitting a LDA model to the statement data; unlike the Tweet data, we categorized the statements into twenty-five topics. We followed the same manual procedure to label the statement topics, and determined a classification threshold of 0.2 using the same inspection procedure we used to find the 0.15 threshold for the Tweet data. The proportions displayed in the Statements visualization are calculated similarly to the proportions in the Tweets visualization.

___





