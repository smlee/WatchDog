'use strict';
var path = require('path');
var express = require('express');
var app = express();
var pfUI = require('pathfinder-ui');
module.exports = app;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));

var fs = require('fs');

// Twilio Credentials
var accountSid = 'AC7e8dce606fa7a9fd2e2d14c7cb2c2915';
var authToken = 'd5d736d89dc8638ca3a357a1e3e657c7';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

app.post('/upload', function(req, res, next) {
    client.messages.create({
        to: "9177966225",
        from: "+19172424225",
        body: "Your laptop is in danger!",
    }, function(err, message) {
        console.log(message.sid);
    });
    res.status(200);
});

app.use('/pf', function(res, req, next){
    pfUI(app);
    next();
}, pfUI.router);

/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */



app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.get('/*', function (req, res) {
    res.sendFile(app.get('indexHTMLPath'));
});

// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});
