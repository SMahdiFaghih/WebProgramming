const http = require("http");
const fs = require('fs');
const express = require("express");
const cors = require("cors");
const mysql = require('mysql');
const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "<yourPassword>"
});

con.connect(function(err) {
    if (err){
        console.log(err);
    } 
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS web_project", function (err, result) {
        if (err){
            console.log(err);
        } 
        console.log("Database created");
    });
});


/*app.post("/", (request, response) => {

});

app.get("/", (req, response) => {

});


app.listen(port, () => {
    console.log(`NodeJs Server is listening at http://127.0.0.1:${port}`);
})*/
