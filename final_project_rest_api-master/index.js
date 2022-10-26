const restify = require('restify');
const mongoose = require('mongoose');
const restify_jwt = require('restify-jwt-community');
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');


const user_route = require('./routes/user');
const project_route = require('./routes/project');
const invite_route = require('./routes/invite');
const working_project_route = require('./routes/working_project');
const project_requests_route = require('./routes/project_requests');
const requests_body_route = require('./routes/request_body');
const requests_params_route = require('./routes/request_params');
const requests_headers_route = require('./routes/request_headers');
const requests_test_cases_route = require('./routes/request_test_cases');

const chat_route = require('./routes/chat');
const project_commit_route = require('./routes/project_commit');
const project_version_route = require('./routes/project_versoin');
const project_log_route = require('./routes/project_log');
const corsMiddleware = require('restify-cors-middleware')



const bodyParser = require('body-parser');
const backBone = "/api";
// app.use(cors());


app.use(bodyParser.json({limit: '100000kb'}));
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))

app.use(bodyParser.urlencoded({extended: true}));
const server = restify.createServer();
server.use(restify.plugins.bodyParser());


// protect all routes unless registration and login entry point
// server.use(restify_jwt({secret: process.env.JWT_SECRET}).unless({path:['/auth']}));

// when server listen connect to the data base









app.listen(process.env.PORT || 5000, () => {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Connected")
    });
});


const db = mongoose.connection;


db.on('error', (error) => {
    console.log(error)
});


db.on('open', () => {
    app.use(backBone, [user_route, project_route, invite_route, working_project_route, project_requests_route,
        requests_body_route, requests_headers_route, requests_params_route, chat_route, project_commit_route,
        project_version_route, project_log_route, requests_test_cases_route]);

    app.use(express.static(__dirname + '/public/'));

// Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

    console.log(`server start on port ---> ${process.env.PORT}`);
});
