const http = require("http");
const express = require("express");
const cors = require("cors");
const mysql = require('mysql');
const app = express();
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const accessTokenSecret = 'youraccesstokensecret';

const port = 8000;

LecturerEmails = ["aabaam@gmail.com", "mrbahrami@gmail.com"]

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "5et422yh",
    database: "web_project",
    multipleStatements: true,
});

var successfulRequestResponse = "OK";
var failedRequestResponse = "Error";

createDatabase();
createIndexes();

app.post("/signup", async (request, response) => {
    console.log("POST /signup");
    const email = request.body.email;
    const password = request.body.password;
    const username = request.body.username;
    const role = request.body.role;
    if (!isEmailValid(email))
    {
        response.status(400).json({ "message": "Email is not valid"});
    }
    if (password.length < 8)
    {
        response.status(400).json({ "message": "Password must contain at least 8 characters."});
    }
    if (role == "student")
    {
        signUpStudent(email, password, username, function(res) 
        {
            if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
            {
                response.status(401).json(res);
            }
            else
            {
                response.json(res);
            }   
        });
    }
    else if (role == "lecturer")
    {
        if (!LecturerEmails.includes(email))
        {
            response.status(400).json({ "message": "Lecturer email not existed at all!"});
        }
        else
        {
            signUpLecturer(email, password, username, function(res) 
            {
                if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                {
                    response.status(401).json(res);
                }
                else
                {
                    response.json(res);
                }
            });
        }
    }
    else
    {
        response.status(400).json({ "message": "Role is invalid"});
    }
});

app.post("/signin", async (request, response) => {
    console.log("POST /signin");
    const email = request.body.email;
    const password = request.body.password;
    if (!isEmailValid(email))
    {
        response.status(400).json({ "message": "Email is not valid"});
    }
    else
    {
        signIn(email, password, function(res) 
        {
            if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
            {
                response.status(401).json(res);
            }
            else
            {
                response.json(res);
            }
        }); 
    }     
});

app.post("/user/edit", async (request, response) => {
    console.log("POST /user/edit");
    const newPassword = request.body.newPassword;
    const newUsername = request.body.newUsername;
    if (newPassword.length < 8)
    {
        response.status(400).json({ "message": "Password must contain at least 8 characters."});
    }
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                editStudent(result.email, newPassword, newUsername, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    }
                }); 
            }
            else if (result.role == "lecturer")
            {
                editLecturer(result.email, newPassword, newUsername, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    }
                }); 
            }
        }
    });
});

app.get("/user/getUserData", async (request, response) => {
    console.log("GET /user/getUserData");
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                getStudentData(result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    }
                }); 
            }
            else if (result.role == "lecturer")
            {
                getLecturerData(result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    }
                }); 
            }
        }
    });
});

app.get("/form/all", async (request, response) => {
    console.log("GET /form/all");
    getAllForms( function(res) 
    {
        if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
        {
            response.status(401).json(res);
        }
        else
        {
            response.json(res);
        }           
    }); 
});

app.get("/form/user", async (request, response) => {
    console.log("GET /form/user");
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                getStudentForms(result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else if (result.role == "lecturer")
            {
                getLecturerForms(result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
        }
    });
});

app.post("/form/search", async (request, response) => {
    console.log("POST /form/search");
    var content = request.body.content;
    searchForms(content, function(res) 
    {
        if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
        {
            response.status(401).json(res);
        }
        else
        {
            response.json(res);
        } 
    });
});

app.post("/form/create", async (request, response) => {
    console.log("POST /form/create");
    const title = request.body.formContent.title;
    const description = request.body.formContent.description;
    const fields = request.body.formContent.fields;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "lecturer")
            {
                createForm(result.email, title, description, fields, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "Students can not create forms"});
            }
        }
    });
});

app.post("/form/close", async (request, response) => {
    console.log("POST /form/closee");
    const formId = request.body.formId;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "lecturer")
            {
                closeForm(result.email, formId, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "Students can not close forms"});
            }
        }
    });
});

app.post("/form/send", async (request, response) => {
    console.log("POST /form/send");
    const formId = request.body.formId;
    const fields = request.body.fields;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                fillForm(formId, result.email, fields, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "You're not a student!"});
            }
        }
    });
});

app.post("/form/edit", async (request, response) => {
    console.log("POST /form/edit");
    const formId = request.body.formId;
    const fields = request.body.fields;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                editForm(formId, result.email, fields, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "You're not a student!"});
            }
        }
    });
});

app.delete("/form/delete", async (request, response) => {
    console.log("DELETE /form/delete");
    const formId = request.query.id;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "student")
            {
                deleteForm(formId, result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "You're not a student!"});
            }
        }
    });
});

app.post("/form/resolve", async (request, response) => {
    console.log("POST /form/resolve");
    const formId = request.body.formId;
    const student_email = request.body.student_email;
    const resolve = request.body.result;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "lecturer")
            {
                resolveForm(result.email, student_email, formId, resolve, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                }); 
            }
            else
            {
                response.status(400).json({ "message": "Students can not resolve forms"});
            }
        }
    });
});

app.post("/form/filledFormData", async (request, response) => {
    console.log("POST /form/filledFormData");
    const formId = request.body.formId;
    const student_email = request.body.student_email;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            getFilledFormData(formId, student_email, function(res) 
            {
                if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                {
                    response.status(401).json(res);
                }
                else
                {
                    response.json(res);
                } 
            });    
        }
    });
});

app.post("/form/students", async (request, response) => {
    console.log("POST /form/students");
    const formId = request.body.formId;
    const student_email = request.body.student_email;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            if (result.role == "lecturer")
            {
                getFormStudents(formId, result.email, function(res) 
                {
                    if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                    {
                        response.status(401).json(res);
                    }
                    else
                    {
                        response.json(res);
                    } 
                });   
            }
            else
            {
                response.status(400).json({ "message": "Students can not get form students"});
            }
        }
    });
});

app.post("/form/emptyFormData", async (request, response) => {
    console.log("POST /form/emptyFormData");
    const formId = request.body.formId;
    if (request.headers.authorization == undefined || request.headers.authorization.split(" ").length < 2)
    {
        return response.status(407).json({ "message": "Authentication failed"});
    }
    const authenticationToken = request.headers.authorization.split(" ")[1];
    if (isNaN(formId))
    {
        return response.status(400).json({ "message": "formId must be a number"});
    }
    jwt.verify(authenticationToken, accessTokenSecret, function(err, result) 
    {
        if (result == undefined)
        {
            response.status(407).json({ "message": "Authentication failed"});
        }
        else
        {
            getEmptyFormData(formId, function(res) 
            {
                if (res.hasOwnProperty("message") && res.message != successfulRequestResponse)
                {
                    response.status(401).json(res);
                }
                else
                {
                    response.json(res);
                } 
            });    
        }
    });
});

function isEmailValid(email)
{
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

function getEmptyFormData(form_id, callback)
{
    var emptyFormData;
    con.query('SELECT * FROM form WHERE form_id = ? AND status = "Open" LIMIT 1', [form_id], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        }
        if (result.length == 0)
        {
            return callback({"message": failedRequestResponse});
        }
        emptyFormData = {"formContent": validateData(result[0])};
        con.query('SELECT * FROM form_fields WHERE form_id = ? ORDER BY id', [form_id], function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            emptyFormData["fields"] = validateData(result);
            return callback(emptyFormData);
        }); 
    });
}

function getFormStudents(form_id, lecturer_email, callback)
{
    con.query('SELECT ff.form_id, ff.student_email, ff.result FROM filled_forms AS ff JOIN form ON form.form_id = ff.form_id WHERE ff.form_id = ? AND lecturer_email = ?', [form_id, con.escape(lecturer_email)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        }
        return callback({"forms": validateData(result)});
    });
}

function getFilledFormData(form_id, student_email, callback)
{
    con.query('SELECT * FROM filled_forms_data WHERE student_email = ? AND form_id = ? ORDER BY id', [con.escape(student_email), form_id], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        }
        return callback({"formContent": validateData(result)});
    });
}

function resolveForm(lecturer_email, student_email, form_id, result, callback)
{
    con.query('UPDATE filled_forms JOIN form ON form.form_id = filled_forms.form_id SET result = ? WHERE filled_forms.form_id = ? AND student_email = ? AND lecturer_email = ?', [result, form_id, con.escape(student_email), con.escape(lecturer_email)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"message": successfulRequestResponse});
    });
}

function deleteForm(form_id, student_email, callback)
{
    con.query('DELETE FROM filled_forms WHERE form_id = ? AND student_email = ? AND result = "Pending"', [form_id, con.escape(student_email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        if (result.affectedRows != 1)
        {
            return callback({"message": "This form is not Pending or not existed"});
        }
        con.query('DELETE FROM filled_forms_data WHERE form_id = ? AND student_email = ?', [form_id, con.escape(student_email)], function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            return callback({"message": successfulRequestResponse});
        });            
    }); 
}

function editForm(form_id, student_email, fields, callback)
{
    con.query('SELECT result FROM filled_forms WHERE form_id = ? AND student_email = ? LIMIT 1', [form_id, con.escape(student_email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        }
        if (result[0].result != "Pending")
        {
            return callback({"message": "You can't edit a form that is resolved"});
        } 
        var updatedFields = fields.map(item => [con.escape(item.data), form_id, con.escape(student_email), con.escape(item.field_name)]);
        var queries = '';
        updatedFields.forEach(function (item) 
        {
            queries += mysql.format("UPDATE filled_forms_data SET data = ? WHERE form_id = ? AND student_Email = ? AND field_name = ?; ", item);
        });
    
        con.query(queries, function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            return callback({"message": successfulRequestResponse});
        }); 
    });          
}

function fillForm(form_id, student_email, fields, callback)
{
    con.query('INSERT IGNORE INTO filled_forms SET form_id = ?, student_email = ?, result = "Pending"', [form_id, con.escape(student_email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        con.query('INSERT INTO filled_forms_data (form_id, student_email, field_name, data, id) VALUES ?', [fields.map(item => [form_id, con.escape(student_email), con.escape(item.field_name), con.escape(item.data), con.escape(item.id)])], function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            return callback({"message": successfulRequestResponse});
        });            
    });   
}

function closeForm(lecturer_email, form_id, callback)
{
    con.query('UPDATE form SET status = "Closed" WHERE form_id = ? AND lecturer_email = ?', [form_id, con.escape(lecturer_email)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"message": successfulRequestResponse});    
    });   
}

function createForm(lecturer_email, title, description, fields, callback)
{
    var form_id;
    con.query('INSERT IGNORE INTO form SET lecturer_email = ?, title = ?, description = ?, status = "Open"', [con.escape(lecturer_email), con.escape(title), con.escape(description)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        form_id = result.insertId;
        con.query('INSERT INTO form_fields (form_id, field_name, required, type, checklist_options, id) VALUES ?', [fields.map(item => [form_id, con.escape(item.field_name), con.escape(item.required), item.type, con.escape(item.checklist_options), con.escape(item.id)])], function (err, result) 
        {
            if (err)
            {
                console.log(err);
                return callback({"message": failedRequestResponse});
            } 
            return callback({"message": successfulRequestResponse});
        });            
    });   
}

function searchForms(content, callback)
{
    con.query('SELECT form_id, username, title, description, status FROM form JOIN lecturer ON form.lecturer_email = lecturer.email WHERE (title LIKE ? OR username LIKE ?) AND status = "Open"', ["%" + con.escape(content) + "%", "%" + con.escape(content) + "%"], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"forms": validateData(result)});
    });
}

function getLecturerForms(lecturerEmail, callback)
{
    con.query('SELECT * FROM form WHERE lecturer_email = ?', [con.escape(lecturerEmail)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"forms": validateData(result)});
    });
}

function getStudentForms(studentEmail, callback)
{
    con.query('SELECT * FROM filled_forms JOIN form ON form.form_id = filled_forms.form_id WHERE student_email = ?', [con.escape(studentEmail)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"forms": validateData(result)});
    });
}

function getAllForms(callback)
{
    con.query('SELECT form_id, username, title, description, status FROM form JOIN lecturer ON form.lecturer_email = lecturer.email WHERE status = "Open"', function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"forms": validateData(result)});
    });
}

function getStudentData(email, callback)
{
    con.query('SELECT email, username FROM student WHERE email = ?', [con.escape(email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        result = validateData(result)
        result[0]["role"] = "student";
        return callback(result);
    }); 
}   

function getLecturerData(email, callback)
{
    con.query('SELECT email, username FROM lecturer WHERE email = ?', [con.escape(email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        result = validateData(result)
        result[0]["role"] = "lecturer";
        return callback(result);
    });    
}

function editStudent(email, newPassword, newUsername, callback)
{
    con.query('UPDATE student SET password = ?, username = ? WHERE email = ?', [con.escape(newPassword), con.escape(newUsername), con.escape(email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"message": successfulRequestResponse});
    }); 
}   

function editLecturer(email, newPassword, newUsername, callback)
{
    con.query('UPDATE lecturer SET password = ?, username = ? WHERE email = ?', [con.escape(newPassword), con.escape(newUsername), con.escape(email)], function (err, result) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        return callback({"message": successfulRequestResponse});
    });    
}

function signIn(email, password, callback)
{
    con.query('SELECT * FROM student WHERE email = ? AND password = ? LIMIT 1', [con.escape(email), con.escape(password)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        if (result.length == 0)
        {
            con.query('SELECT * FROM lecturer WHERE email = ? AND password = ? LIMIT 1', [con.escape(email), con.escape(password)], function (err, result, fields) 
            {
                if (err)
                {
                    return callback({"message": failedRequestResponse});
                } 
                if (result.length == 0)
                {
                    return callback({"message": "Email or password is incorrect"});
                }
                const accessToken = jwt.sign({ email: email,  role: "lecturer" }, accessTokenSecret);
                return callback({"token": accessToken});
            });
        }
        else
        {
            const accessToken = jwt.sign({ email: email,  role: "student" }, accessTokenSecret);
            return callback({"token": accessToken});
        }
    });
}

function signUpStudent(email, password, username, callback)
{
    con.query('SELECT * FROM student WHERE email = ? LIMIT 1', [con.escape(email)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        if (result.length != 0)
        {
            return callback({"message": "Student exists with this email"});
        }
        con.query('INSERT INTO student SET email = ?, password = ?, username = ?', [con.escape(email), con.escape(password), con.escape(username)], function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            const accessToken = jwt.sign({ email: email,  role: "student" }, accessTokenSecret);
            return callback({"token": accessToken});
        });
    });
}

function signUpLecturer(email, password, username, callback)
{
    con.query('SELECT * FROM lecturer WHERE email = ? LIMIT 1', [con.escape(email)], function (err, result, fields) 
    {
        if (err)
        {
            return callback({"message": failedRequestResponse});
        } 
        if (result.length != 0)
        {
            return callback({"message": "Lecturer exists with this email"});
        }
        con.query('INSERT INTO lecturer SET email = ?, password = ?, username = ?', [con.escape(email), con.escape(password), con.escape(username)], function (err, result) 
        {
            if (err)
            {
                return callback({"message": failedRequestResponse});
            } 
            const accessToken = jwt.sign({ email: email,  role: "lecturer" }, accessTokenSecret);
                return callback({"token": accessToken});
        });
    });
}

function validateData(result)
{
    if (result.length == undefined)
    {
        var item = result;
        Object.keys(item).forEach(function(key) 
        {
            if (key != "form_id" && key != "required")
            {
                item[key] = item[key].toString().split("'").join("");
            }
        });
    }

    for (let i = 0; i < result.length; i++) 
    {
        var item = result[i];
        Object.keys(item).forEach(function(key) 
        {
            if (key != "form_id" && key != "required")
            {
                item[key] = item[key].toString().split("'").join("");
            }
        });
    }    
    return result;
}

function createIndexes()
{
    con.query("CREATE INDEX index_username ON lecturer (username);", function(err)
    {
        console.log("Index index_username created");
    });  
    con.query("CREATE INDEX index_title ON form (title);", function(err)
    {
        console.log("Index index_title created");
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
            con.query("CREATE TABLE IF NOT EXISTS form (form_id INT NOT NULL AUTO_INCREMENT UNIQUE, lecturer_email VARCHAR(128) NOT NULL, title VARCHAR(128) NOT NULL, description VARCHAR(2048) NOT NULL, status ENUM ('Open' , 'Closed') NOT NULL, PRIMARY KEY (lecturer_email, title), FOREIGN KEY (lecturer_email) references lecturer (email) on delete cascade on update cascade)", function(err)
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
            con.query("CREATE TABLE IF NOT EXISTS form_fields (form_id INT NOT NULL, field_name VARCHAR(128) NOT NULL, required TINYINT(1) NOT NULL, type ENUM ('TextField' , 'CheckList') NOT NULL, checklist_options VARCHAR(256), id INT NOT NULL, PRIMARY KEY (form_id, field_name), FOREIGN KEY (form_id) references form (form_id) on delete cascade on update cascade)", function(err)
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
            con.query("CREATE TABLE IF NOT EXISTS filled_forms_data (form_id INT NOT NULL, student_email VARCHAR(128) NOT NULL, field_name VARCHAR(128) NOT NULL, data VARCHAR(512), id INT NOT NULL, PRIMARY KEY (form_id, student_email, field_name), FOREIGN KEY (student_email) references student (email) on delete cascade on update cascade, FOREIGN KEY (form_id, field_name) references form_fields (form_id, field_name) on delete cascade on update cascade)", function(err)
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

app.listen(port, () => {
    console.log(`NodeJs Server is listening at http://127.0.0.1:${port}`);
})
