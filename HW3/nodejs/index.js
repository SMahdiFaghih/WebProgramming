var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var ParseApp = express();
var Parse = require('parse/node');

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

Parse.initialize("myAppId");
Parse.serverURL = 'http://localhost:1337/parse'


//Insert
const GameScore = Parse.Object.extend("Test");
const gameScore = new GameScore();
gameScore.save({
  score: 1000,
  playerName: "Mahdi",
  cheatMode: false
})
.then((gameScore) => {
  console.log('saved');
}, (error) => {
  console.log('failed');
});


//Select
const query = new Parse.Query(GameScore);
query.get("TvqziIU6H8")
.then((gameScore) => {
  const score = gameScore.get("score");
  console.log(score);
}, (error) => {
  console.log(error);
});


//Update
const query2 = new Parse.Query(GameScore);
query2.get("TvqziIU6H8")
.then((gameScore) => {
  gameScore.set("cheatMode", true);
  gameScore.set("score", 2000);
  gameScore.set("ali", "work");
  gameScore.unset("playerName");
  gameScore.save();
  console.log("saved Set");
}, (error) => {
  console.log(error);
});


//Delete
const query3 = new Parse.Query(GameScore);
query3.get("BJEQeUXkk9")
.then((gameScore) => {
  gameScore.destroy().then((gameScore) => {
    console.log("object deleted");
  }, (error) => {
    console.log(error);
  });
}, (error) => {
  console.log(error);
});