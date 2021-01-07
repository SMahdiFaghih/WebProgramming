var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var ParseApp = express();

var api = new ParseServer({
  databaseURI: 'mongodb+srv://<Username>:<Password>@cluster0.a8oee.mongodb.net/<dbname>?retryWrites=true&w=majority',
  //databaseURI: 'mongodb://localhost:27017/web', // Connection string for your MongoDB database
  //cloud: './cloud/main.js', // Path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  fileKey: 'optionalFileKey',
  serverURL: 'http://localhost:1337/parse' // Don't forget to change to https if needed
});

// Serve the Parse API on the /parse URL prefix
ParseApp.use('/parse', api);

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/parse",
      "appId": "myAppId",
      "masterKey": "myMasterKey",
      "appName": "MyApp"
    }
  ]
});

// make the Parse Dashboard available at /dashboard
ParseApp.use('/dashboard', dashboard);

ParseApp.listen(1337, function() {
    console.log('parse-server-example running on port 1337.');
  });