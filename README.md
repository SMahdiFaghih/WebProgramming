# WebProgramming
WebProgramming Project and HomeWorks (99 Fall semester)

# Assignment 1
  this is a simple program to undrestand basics of web programming
  
  the first part of the program adds two numbers by sha256
  
  the second part gives you a line from a 100 line file
  
  - clone the repository in your centOS virtual machine
  - run ```chmod +x {YOUR_PROJECT_DIRECTORY}```
  - use the configs in sections below to create service and set your local roots in there
  - dont forget ```setenforce 0```
  - run services
  - type your virtualmachine ip on your browser
  - enjoy! :)

## nodejs 
run ```npm install``` in nodejs directory to install requirements
### node service
```
[Unit]
Description=node-app
[Service]
Type=simple
Restart=always
RestartSec=2s
#adress of your input.txt file
WorkingDirectory=/root/WebProgramming/HW1/nodejs
#adress of your nodejs project
ExecStart=/usr/bin/node /root/WebProgramming/HW1/nodejs/sha256.js
[Install]
WantedBy=multi-user.target
```


## go
run ```go build sha256.go``` in go directory
### go service
```
[Unit]
Description=go-app
[Service]
Type=simple
Restart=always
RestartSec=2s
#adress of your input.txt file
WorkingDirectory=/root/WebProgramming/HW1/go
#adress of your built go project
ExecStart=/root/WebProgramming/HW1/go/sha256
[Install]
WantedBy=multi-user.target
```

## locust
after installing locust using ```pip3 install locust```, run locust command in the project locust folder. Then go to 127.0.0.1:8089 and start testing!

Review and compare the results and RPS obtained for 4 different operations:

If we consider the number of users to be 10000 and the spawn rate equal to 1000, the number of failed tasks will increase to about 30% due to the load imposed on the server, and the RPS of all these commands will be around 125. However, in this case, for sha256 command with nodejs and write using go, this value will be about 130
By reducing the number of users to 1000 and spawn rate to 100, the problem of failing the tests will be solved (failed task will be almost 1%), and in the end, the RPS will be about 145, which is more for commands that use GET than commands with POST and for the sha256 operation in nodejs will ne about 144 and for go will be about 142. 
This means that nodejs operations are a bit faster because their average response time is 101ms for both opearation which is 106ms for write and 109ms for sha256 operations in go. 

# Assignment 3
To run the project go to nodejs2 folder and run commands "npm install" to install requirements and "npm start run" and server will run in localhost:8000. then by going to front folder, run commands "npm install" to install requirements and "npm run serve". your frontend will be run in localhost:3000 and you can start using the application.
