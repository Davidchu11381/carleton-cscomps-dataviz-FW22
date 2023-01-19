# Data Visualization for Government Transparency: A Carleton CS Comps project #

---
Here is a section that details ways to to view the industry data within our MongoDB database.

To access collection of industry data go to the command line and type in the following:
 ```
  $ mongosh
  
  $ use comps
  ```

Then, use any of the below queries to view the information you want:

#### To show all industries and their info(name, code, list congresspeople) in the collection:

```
	$ db.industries.find()
```

#### To show industries sorted by total donations in descending order(excluding list of congresspeople for readability):

```
	$ db.industries.find({}, {"name": 1, "code": 1, "total": 1}).sort({ "total": -1})
```

#### To find an industry by any field:
```
  $ db.industries.find({field_name: field_value})
```

Ex. ```db.industries.find({name: "Education"})```
  
---

There are two APIs used in this project. Both of them were created in Flask, and to start them, run this in the command line within the project directory:

$ export FLASK_APP=industryAPI.py

$ flask run --host 0.0.0.0 --port 5000

Open up a new terminal and run this:

$ export FLASK_APP=politicianAPI.py

$ flask run --host 0.0.0.0 --port 5001

Then, go to your browser and go to http://localhost:5000/ or http://localhost:5001/ to access the respective API's. 

___

## Politician API:

The format of all endpoints in this API is http://localhost:5001/ + politician cid + desired query for that politician.

For example, if you want the top industries for a politician with CID N00003535, you would use http://localhost:5001/N00003535/industries. The rest of the endpoints are formatted exactly the same, refer to the comments of the API for more details.

## Industry API:

The format of all endpoints in this API is http://localhost:5000/ + industry code + desired query for that industry.

For example, if you want the top 10 for a industry with CID W04, you would use http://localhost:5000/W04/10. 
