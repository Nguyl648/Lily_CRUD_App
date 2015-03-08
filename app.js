/* 

DT Project Tracker App with Parse Database (parse.com)
March 2015

*/

// IMPORT DEPENDENCIES

// We will need 'Express' module
var express = require('express');
// To be able to decipher post request, we need to require body-parser
var bodyParser = require('body-parser');
// Refer our server to 'app'
// Reference at http://expressjs.com/api.html
// http://erichonorez.wordpress.com/2013/02/04/a-basic-web-server-with-node-js-and-express/
var app = express();
var fs = require('fs');
// Inject Parse API (https://github.com/Leveton/node-parse-api)
var Parse = require('node-parse-api').Parse;

var options = {
    app_id: 'GFka5aLSNZ5sr9eRmJop0xEzxJ2s3GbmmIPv7t3w',
    api_key: 'xmO74h9DrAdmQKX4sjIYHwL5UhrFqDh8nDIurr1F' // parse.com key id
};
var parse = new Parse(options);
// Add crypto for encrypting email
var crypto = require('crypto');


// MIDDLEWARE (functions to handle req)
    // = bodyParser(): access incoming date, .use

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    // Setup a Cross Origin Resource sharing
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log('incoming request from ---> ' + ip);
    // Show the target URL that the user just hit
    var url = req.originalUrl;
    console.log('### requesting ---> ' + url);
    next();
});

app.use('/', express.static(__dirname + '/public')); // (Root route, render static site (web view))
//__dirname: displays name of current folder where app.js file is


/* 
Routers: what to do when it gets a req from server
    HTTP methods: .get .post .put .delete
*/

// Get all projects (browser view)
// When app gets req that points to 'projects' > execute function with no name
app.get('/projects', function(req, res) { //callback parameters Request and Response
    var hash = 'user_' + crypto.createHash('md5').update(req.query.email).digest('hex');
    console.log(hash);
    // Fetch data from a Parse via findMany
    parse.findMany(hash, '', function(err, data) {
        if(err) {
            console.log(err);
        }
        console.log(data);
        res.json({ //method on res object: send a JSON response to client 
            data: data
        });
    });
});

// Get a project
    // Get Method Route (Express)
app.get('/project', function(req, res) {
    var hash = 'user_' + crypto.createHash('md5').update(req.query.email).digest('hex');
    console.log(hash);
    // Fetch data from a Parse via find
    parse.find(hash, req.body.id, function(err, data) {
        if(err) {
            console.log(err);
        }
        console.log(data);
        res.json({
            data: data
        });
    });
});

// Create a project
app.post('/project', function(req, res) { //same route but diff. method to create new data
    console.log(req.body);
    console.log(req.body['p_title']);
    console.log(req.body['p_deadline']);
    
    var hash = 'user_' + crypto.createHash('md5').update(req.body.user).digest('hex');
    
    parse.insert(hash, {
        p_title: req.body['p_title'],
        p_deadline: req.body['p_deadline']
    
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Parse: Inserted project');
            res.json({
                status: 'OK'
            });
        }
    });
});

// Update a project
app.put('/project', function(req, res) {
    console.log('updated: ' + req.body.id);
    var hash = 'user_' + crypto.createHash('md5').update(req.body.user).digest('hex');
    parse.update(hash, req.body.id, { //node-parse-api 
        p_title: req.body['p_title'],
        p_deadline: req.body['p_deadline']     
    }, function(err, res) {
        console.log(res);
    });    
});

// Delete a project
app.delete('/project', function(req, res) {
    console.log('deleting ' + req.body.id);
    var hash = 'user_' + crypto.createHash('md5').update(req.body.user).digest('hex');
    parse.delete(hash, req.body.id, function(err) {
        if (!err) {
            res.json({
                status: 'OK'
            });
        }
    });
});

// Bonus!
app.post('/register', function(req, res) {
    console.log(req.body);
    var hash = 'user_' + crypto.createHash('md5').update(req.body.email).digest('hex');
    parse.insert(hash, {}, function(err, data) {
        console.log('Parse: Inserting: ' + req.body.email + ' as ' + hash);
        if (err) {
            console.log(err);
        } else {
            res.json({
                email: req.body.email
            });
        }
    });
});

/*

Initialize server

*/

var PORT = 80; //the port you want to use
app.listen(PORT, function() {
    console.log('Server running at port ' + PORT + '. Ctrl+C to terminate.');
});