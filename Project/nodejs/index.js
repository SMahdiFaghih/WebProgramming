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

app.post("/signup", async (request, response) => {
    console.log("POST /signup");
    const email = request.body.email;
    const password = request.body.password;
    const username = request.body.username;
    const role = request.body.role;
    if (!emailIsValid(email))
    {
        return response.status(400).json({ "message": "Email is not valid"});
    }
    if (password.length < 8)
    {
        return response.status(400).json({ "message": "Password must contain at least 8 characters."});
    }
    if (role == "student")
    {
        signUpStudent(email, password, username, function(res) 
        {
            response.json({ "message": res });
        });
    }
    else if (role == "lecturer")
    {
        if (!LecturerEmails.includes(email))
        {
            return response.status(400).json({ "message": "Lecturer email not existed at all!"});
        }
        signUpLecturer(email, password, username, function(res) 
        {
            response.json({ "message": res });
        });
    }
    else
    {
        return response.status(400).json({ "message": "Role is invalid"});
    }
});

app.post("/signin", (request, response) => {
    console.log("POST /signin");
    const email = request.body.email;
    const password = request.body.password;
    const role = request.body.role;
    if (!emailIsValid(email))
    {
        return response.status(400).json({ "message": "Email is not valid"});
    }
    if (role == "student")
    {
        var res = signInStudent(email, password);
        response.json(res);
    }
    else if (role == "lecturer")
    {
        var res = signInLecturer(email, password);
        response.json(res);
    }
    else
    {
        console.log("Role is invalid");
        return response.status(400).json({ "message": "Role is invalid"});
    }
});

app.post("/user/edit", (request, response) => {
    console.log("POST /user/edit");
    const newPassword = request.body.newPassword;
    const newUsername = request.body.newUsername;
    const authenticationToken = request.headers.authorization;
    console.log(authenticationToken);
    var email = jwt.verify(authenticationToken, accessTokenSecret, "student");
    console.log(email);
    var email2 = jwt.verify(authenticationToken, accessTokenSecret, "lecurer");
    console.log(email2);
    /*if (role == "student")
    {
        var res = editStudent(email, newPassword, newUsername);
        response.json(res);
    }
    else if (role == "lecturer")
    {
        var res = editLecturer(email, newPassword, newUsername);
        response.json(res);
    }
    else
    {
        console.log("Role is invalid");
        return response.status(400).json({ "message": "Role is invalid"});
    }*/
});

function emailIsValid(email)
{
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

function getFormStudents(form_id, lecturer_email)
{
    con.query('SELECT ff.form_id, ff.student_email, ff.result FROM filled_forms AS ff JOIN form ON form.form_id = ff.form_id WHERE ff.form_id = ? AND lecturer_email = ?', [form_id, lecturer_email], function (err, result, fields) 
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

function getFormData(form_id, student_email)
{
    con.query('SELECT * FROM filled_forms_data WHERE student_email = ? AND form_id = ?', [student_email, form_id], function (err, result, fields) 
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

function resolveForm(lecturer_email, student_email, form_id, result)
{
    con.query('UPDATE filled_forms JOIN form ON form.form_id = filled_forms.form_id SET result = ? WHERE filled_forms.form_id = ? AND student_email = ? AND lecturer_email = ?', [result, form_id, student_email, lecturer_email], function (err, result, fields) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        } 
        console.log("1 form resolved");
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

function editForm(form_id, student_email, fields)
{
    con.query('SELECT result FROM filled_forms WHERE form_id = ? AND student_email = ? LIMIT 1', [form_id, student_email], function (err, result) 
    {
        if (err)
        {
            console.log(err);
            return failedRequestResponse;
        }
        if (result.result!= "Pending")
        {
            console.log("You can't edit a form that is resolved");
            return failedRequestResponse;
        } 
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
    con.query('UPDATE student SET password = ?, username = ? WHERE email = ?', [newPassword, newUsername, email], function (err, result) 
    {
        if (err)
        {
            return {"message": failedRequestResponse};
        } 
        return {"message": successfulRequestResponse};
    }); 
}   

function editLecturer(email, newPassword, newUsername)
{
    con.query('UPDATE lecturer SET password = ?, username = ? WHERE email = ?', [newPassword, newUsername, email], function (err, result) 
    {
        if (err)
        {
            return {"message": failedRequestResponse};
        } 
        return {"message": successfulRequestResponse};
    });    
}

function signInStudent(email, password)
{
    con.query('SELECT * FROM student WHERE email = ? AND password = ? LIMIT 1', [email, password], function (err, result, fields) 
    {
        if (err)
        {
            return {"message": failedRequestResponse};
        } 
        if (result.length == 0)
        {
            return {"message": "Email or password is incorrect for student"};
        }
        const accessToken = jwt.sign({ email: email,  role: "student" }, accessTokenSecret);
        return {"token": accessToken};
    });
}

function signInLecturer(email, password)
{
    con.query('SELECT * FROM lecturer WHERE email = ? AND password = ? LIMIT 1', [email, password], function (err, result, fields) 
    {
        if (err)
        {
            return {"message": failedRequestResponse};
        } 
        if (result.length == 0)
        {
            return {"message": "Email or password is incorrect for lecturer"};
        }
        const accessToken = jwt.sign({ email: email,  role: "lecturer" }, accessTokenSecret);
        return {"token": accessToken};
    });
}

function signUpStudent(email, password, username, callback)
{
    con.query('SELECT * FROM student WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            return callback(failedRequestResponse);
        } 
        if (result.length != 0)
        {
            return callback("Student exists with this email");
        }
        con.query('INSERT INTO student SET email = ?, password = ?, username = ?', [email, password, username], function (err, result) 
        {
            if (err)
            {
                return callback(failedRequestResponse);
            } 
            return callback(successfulRequestResponse);
        });
    });
}

function signUpLecturer(email, password, username, callback)
{
    con.query('SELECT * FROM lecturer WHERE email = ? LIMIT 1', [email], function (err, result, fields) 
    {
        if (err)
        {
            return callback(failedRequestResponse);
        } 
        if (result.length != 0)
        {
            return callback("Lecturer exists with this email");
        }
        con.query('INSERT INTO lecturer SET email = ?, password = ?, username = ?', [email, password, username], function (err, result) 
        {
            if (err)
            {
                return callback(failedRequestResponse);
            } 
            return callback(successfulRequestResponse);
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


/*app.get("/", (req, response) => {

});*/


app.listen(port, () => {
    console.log(`NodeJs Server is listening at http://127.0.0.1:${port}`);
})
