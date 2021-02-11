const http = require("http");
const express = require("express");
const cors = require("cors");
const mysql = require('mysql');
const app = express();
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const accessTokenSecret = 'youraccesstokensecret';

const port = 3000;

LecturerEmails = ["aabaam@gmail.com", "mrbahrami@gmail.com"]

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "<yourPassword>",
    database: "web_project",
    multipleStatements: true,
});

var successfulRequestResponse = "OK";
var failedRequestResponse = "Error";

createDatabase();
responseToForm("aabaam@gmail.com", "s@gmail.com", 27, "Accepted");

app.post("/signup", (request, response) => {
    console.log("POST /signup");
    const email = request.body.email;
    const password = request.body.password;
    const username = request.body.username;
    //todo check to prevent invalid email
    const role = request.body.role;
    if (role == "student")
    {
        var res = signUpStudent(email, password, username);
        response.json({ "status": res });
    }
    else if (role == "lecturer")
    {
        var res = signUpLecturer(email, password, username);
        response.json({ "status": res });
    }
    else
    {
        console.log("role is invalid");
        return response.status(400).end('role is invalid');
    }
});

function responseToForm(lecturer_email, student_email, form_id, result)
{
    con.query('UPDATE filled_forms JOIN form ON form.form_id = filled_forms.form_id SET result = ? WHERE filled_forms.form_id = ? AND student_email = ? AND lecturer_email = ?', [result, form_id, student_email, lecturer_email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log("1 form answered");
        return successfulRequestResponse;
    });
}

function deleteForm(form_id, student_email)
{
    con.query('DELETE FROM filled_forms WHERE form_id = ? AND student_email = ? AND result = "Pending"', [form_id, student_email], function (err, result) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.affectedRows != 1)
        {
            console.log("your form is not Pending or not existed");
            return failedRequestResponse;
        }
        con.query('DELETE FROM filled_forms_data WHERE form_id = ? AND student_email = ?', [form_id, student_email], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            console.log(result.affectedRows + " records deleted from filled_forms_data table");
            return successfulRequestResponse;
        });            
    }); 
}

function editFilledForm(form_id, student_email, fields)
{
    var updatedFields = fields.map(item => [item.data, form_id, student_email, item.field_name]);
    var queries = '';
    updatedFields.forEach(function (item) {
        queries += mysql.format("UPDATE filled_forms_data SET data = ? WHERE form_id = ? AND student_Email = ? AND field_name = ?; ", item);
    });

    con.query(queries, function (err, result) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log(fields.length + " records edited in filled_forms_data table");
        return successfulRequestResponse;
    });      
}

function fillForm(form_id, student_email, fields)
{
    con.query('INSERT IGNORE INTO filled_forms SET form_id = ?, student_email = ?, result = "Pending"', [form_id, student_email], function (err, result) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log("1 record inserted to filled_forms table");
        con.query('INSERT INTO filled_forms_data (form_id, student_email, field_name, data) VALUES ?', [fields.map(item => [form_id, student_email, item.field_name, item.data])], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            console.log(fields.length + " records inserted to filled_forms_data table");
            return successfulRequestResponse;
        });            
    });   
}

function closeForm(lecturer_email, form_id)
{
    con.query('UPDATE form SET status = "Closed" WHERE form_id = ? AND lecturer_email = ?', [form_id, lecturer_email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log("1 form Closed");
        return successfulRequestResponse;
    });   
}

function createForm(lecturer_email, title, description, fields)
{
    var form_id;
    con.query('INSERT INTO form SET lecturer_email = ?, title = ?, description = ?, status = "Open"', [lecturer_email, title, description], function (err, result) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log("1 record inserted to form table");
        form_id = result.insertId;
        con.query('INSERT INTO form_fields (form_id, field_name, required, type, checklist_options) VALUES ?', [fields.map(item => [form_id, item.field_name, item.required, item.type, item.checklist_options])], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            console.log(fields.length + " records inserted to form_fileds table");
            return successfulRequestResponse;
        });            
    });   
}

function searchForms(content)
{
    con.query('SELECT form_id, username, title, description, status FROM form JOIN lecturer ON form.lecturer_email = lecturer.email WHERE (title LIKE ? OR username LIKE ?) AND status = "Open"', ["%" + content + "%", "%" + content + "%"], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log(result);
        return result;
    });
}

function getLecturerForms(lecturerEmail)
{
    con.query('SELECT * FROM form WHERE lecturer_email = ?', [lecturerEmail], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log(result);
        return result;
    });
}

function getStudentForms(studentEmail)
{
    con.query('SELECT * FROM filled_forms JOIN form ON form.form_id = filled_forms.form_id WHERE student_email = ?', [studentEmail], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log(result);
        return result;
    });
}

function getAllForms()
{
    con.query('SELECT form_id, username, title, description, status FROM form JOIN lecturer ON form.lecturer_email = lecturer.email WHERE status = "Open"', function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log(result);
        return result;
    });
}

function editStudent(email, newPassword, newUsername)
{
    con.query('SELECT * FROM student WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length == 0)
        {
            console.log("email or password is incorrect for student");
            return failedRequestResponse;
        }
        con.query('UPDATE student SET password = ?, username = ? WHERE email = ?', [newPassword, newUsername, email], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            console.log("student info edited");
            return successfulRequestResponse;
        });
    });
}

function editLecturer(email, newPassword, newUsername)
{
    con.query('SELECT * FROM lecturer WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length == 0)
        {
            console.log("email or password is incorrect for lecturer");
            return failedRequestResponse;
        }
        con.query('UPDATE lecturer SET password = ?, username = ? WHERE email = ?', [newPassword, newUsername, email], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return failedRequestResponse;
            } 
            console.log("lecturer info edited");
            return successfulRequestResponse;
        });
    });
}

function signInStudent(email, password)
{
    con.query('SELECT * FROM student WHERE email = ? AND password = ? LIMIT 1', [email, password], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length == 0)
        {
            console.log("email or password is incorrect for student");
            return failedRequestResponse;
        }
        console.log("student signedIn");
        const accessToken = jwt.sign({ email: email,  role: "student" }, accessTokenSecret);
        console.log(accessToken);
        return successfulRequestResponse;
    });
}

function signInLecturer(email, password)
{
    con.query('SELECT * FROM lecturer WHERE email = ? AND password = ? LIMIT 1', [email, password], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        if (result.length == 0)
        {
            console.log("email or password is incorrect for lecturer");
            return failedRequestResponse;
        }
        console.log("lecturer signedIn");
        const accessToken = jwt.sign({ email: email,  role: "lecturer" }, accessTokenSecret);
        console.log(accessToken);
        return successfulRequestResponse;
    });
}

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
            console.log("1 record inserted to student table");
            return successfulRequestResponse;
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
            console.log("1 record inserted to lecturer table");
            return successfulRequestResponse;
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
            con.query("CREATE TABLE IF NOT EXISTS form_fields (form_id INT NOT NULL, field_name VARCHAR(128) NOT NULL, required TINYINT(1) NOT NULL, type ENUM ('TextField' , 'CheckList') NOT NULL, checklist_options VARCHAR(256), PRIMARY KEY (form_id, field_name), FOREIGN KEY (form_id) references form (form_id) on delete cascade on update cascade)", function(err)
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
            con.query("CREATE TABLE IF NOT EXISTS filled_forms_data (form_id INT NOT NULL, student_email VARCHAR(128) NOT NULL, field_name VARCHAR(128) NOT NULL, data VARCHAR(512), PRIMARY KEY (form_id, student_email, field_name), FOREIGN KEY (student_email) references student (email) on delete cascade on update cascade, FOREIGN KEY (form_id, field_name) references form_fields (form_id, field_name) on delete cascade on update cascade)", function(err)
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
