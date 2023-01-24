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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

