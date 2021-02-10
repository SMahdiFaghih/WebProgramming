const http = require("http");
const fs = require('fs');
const express = require("express");
const cors = require("cors");
const mysql = require('mysql');
const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

LecturerEmails = ["aabaam@gmail.com", "mrbahrami@gmail.com"]

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "<yourPassword>",
    database: "web_project"
});

var successfulRequestResponse = "admit";
var failedRequestResponse = "reject";

createDatabase();
signUpLecturer("aabaam@gmail.com", 12345, "mahdi");

function signUpStudent(email, password, username)
{
    con.query('SELECT * FROM student WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length != 0)
        {
            console.log("student exists with this email");
            return failedRequestResponse;
        }
        con.query('INSERT INTO student SET email = ?, password = ?, username = ?', [email, password, username], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            else
            {
                console.log("1 record inserted to student table");
                return successfulRequestResponse;
            }
        });
    });
}

function signUpLecturer(email, password, username)
{
    if (!LecturerEmails.includes(email))
    {
        console.log("lecturer email not existed at all!");
        return failedRequestResponse;
    }
    con.query('SELECT * FROM lecturer WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length != 0)
        {
            console.log("lecturer exists with this email");
            return failedRequestResponse;
        }
        con.query('INSERT INTO lecturer SET email = ?, password = ?, username = ?', [email, password, username], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            else
            {
                console.log("1 record inserted to lecturer table");
                return successfulRequestResponse;
            }
        });
    });
}

function createDatabase()
{
    con.connect(function(err) 
    {
        if (err)
        {
            console.log(err);
        } 
        else
        {
            console.log("Connected!");
            con.query("CREATE DATABASE IF NOT EXISTS web_project;", function(err)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Database created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS student (email VARCHAR(128) PRIMARY KEY NOT NULL, password VARCHAR(128) NOT NULL, username VARCHAR(128) NOT NULL)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table student created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS lecturer (email VARCHAR(128) PRIMARY KEY NOT NULL, password VARCHAR(128) NOT NULL, username VARCHAR(128) NOT NULL)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table lecturer created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS form (form_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, lecturer_email VARCHAR(128) NOT NULL, title VARCHAR(128) NOT NULL, description VARCHAR(2048) NOT NULL, status ENUM ('Open' , 'Closed') NOT NULL, FOREIGN KEY (lecturer_email) references lecturer (email) on delete cascade on update cascade)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table form created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS form_fields (form_id INT NOT NULL, description VARCHAR(128) NOT NULL, required TINYINT(1) NOT NULL, type ENUM ('TextField' , 'CheckList') NOT NULL, checklist_options VARCHAR(256), PRIMARY KEY (form_id, description), FOREIGN KEY (form_id) references form (form_id) on delete cascade on update cascade)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table form_fields created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS filled_forms (form_id INT NOT NULL, student_email VARCHAR(128) NOT NULL, result ENUM ('Accepted' , 'Rejected', 'Pending') NOT NULL, PRIMARY KEY (form_id, student_email), FOREIGN KEY (form_id) references form (form_id) on delete cascade on update cascade, FOREIGN KEY (student_email) references student (email) on delete cascade on update cascade)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table filled_forms created");
                } 
            });
            con.query("CREATE TABLE IF NOT EXISTS filled_forms_data (form_id INT NOT NULL, student_email VARCHAR(128) NOT NULL, field_description VARCHAR(128) NOT NULL, data VARCHAR(512), PRIMARY KEY (form_id, student_email, field_description), FOREIGN KEY (student_email) references student (email) on delete cascade on update cascade, FOREIGN KEY (form_id, field_description) references form_fields (form_id, description) on delete cascade on update cascade)", function(err)
            {
                if (err)
                {
                    console.log(err);
                } 
                else
                {
                    console.log("Table filled_forms_data created");
                } 
            });
        }
    });
}


/*app.post("/", (request, response) => {

});

app.get("/", (req, response) => {

});


app.listen(port, () => {
    console.log(`NodeJs Server is listening at http://127.0.0.1:${port}`);
})*/
