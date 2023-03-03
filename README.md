# Data Visualization for Government Transparency: A Carleton CS Comps project #

The goal of this project is allow users to discover connections between industries that fund members of Congress and statements made by those members via interactive data visualizations.

Users are able to input any arbitrary subset of congresspeople or select pre-made groups of congresspeople(Senators, Democrats, etc.). From there, three visualizations will be displayed.

1. A Sankey diagram showing the breakdown of the top 10 industries that fund the congressperson(s).

2. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) Tweets.

3. A Sankey diagram showing the breakdown of the distribution of the topics found in the congressperson(s) congressional statements.


---

Open up a new terminal and run this:

$ export FLASK_APP=politicianAPI.py

$ flask run --host 0.0.0.0 --port 5001

Then, go to your browser and go to http://localhost:5001/ to access the API. 
___


