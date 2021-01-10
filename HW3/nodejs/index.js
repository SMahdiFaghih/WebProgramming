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


ParseApp.post("/signin", (request, response) => {
  console.log("POST /signin");
  const email = request.body.email;
  const password = request.body.password;
  if (!validateEmail(email))
  {
    return response.status(400).json({ "message": "filed `email` is not valid"});
  }
  if (Object.keys(request.body).length > 2)
  {
    return response.status(400).json({ "message": "Request Length should be 2"});
  }
  const query = new Parse.Query(Users);
  query.equalTo("email", email);
  query.limit(1);
  query.find().then((results) => {
    if (results.length == 0 || results[0].get("password" != password))
    {
      return response.status(401).json({ "message": "wrong email or password."});
    }
    var token = makeToken(64);
    results[0].set("token", token);
    results[0].save().then(() => {
      return response.status(200).json({ "token": token});
    }, () => {
      console.log('save failed');
    });
  }, () => {
    console.log('find failed');
  });
});

ParseApp.get("/signin", (req, response) => {
  return response.status(405).json({ "message": "Only `Post` Method is Valid"});
});

function validateEmail(email)
{
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

function makeToken(length) 
{
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) 
  {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




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