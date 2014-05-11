#!/bin/env node
var express   = require('express');
var fs        = require('fs');
var httpProxy = require('http-proxy');
var WebSocketServer = require('ws').Server;
var path = require('path');
var api = require('./api/api');
/**
 *  Define the sample application.
 */
var BheemServer = function() {
    var self = this;

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.IP || '0.0.0.0';
        self.port = 80;
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
        self.zcache['helpme.html'] = fs.readFileSync('./helpme.html');
        self.zcache['helper.html'] = fs.readFileSync('./helper.html');
        self.zcache['police-console.html'] = fs.readFileSync('./police-console.html');

    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        /*
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
        */
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };
        self.location = {}

        self.routes['/'] = function(req, res) {
            req.session.u = req.param('u');
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
        self.routes['/helpme'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            self.location = {
                location:[req.query.latitude,req.query.longitude],
                types:null
            };
            console.log(self.location);
            res.send(self.cache_get('helpme.html') );
        }
        self.routes['/police-console'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('police-console.html') );
        }

        var policeStatusMarkup = fs.readFileSync('./police-status.html')

        self.routes['/police'] = function(req,res){
            self.location.types="police";
            console.log(self.location);
            api.get(self.location,function(data){
                data.results.forEach(function(d){
                    res.send(policeStatusMarkup.toString().replace("{{POLICE_ADDRESS}}", "<div class='panel panel-warning'><div class=panel-heading><p class='panel-title btn-info'>"+d.name+"</p></div>"+"<div class=panel-body><img src="+d.icon+"><h3><a href='tel:+918022942545'>+91-80-22942545</a></h3>"+d.vicinity+"</div></div>"));
                })
                console.log(self.location);
                console.log(data);
            });
        };
        self.routes['/helper'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('helper.html') );
        }

        self.routes['/api*'] = function(req, res) {
            req.url = req.url.substring(4);
            req.url += '?api_key=9673fbfd2537cc9da1ac0d935ed23711';

            console.log(req.url);
            self.proxy.web(req, res);
        }
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        self.app.use(express.cookieParser('bh33Mu$3R'));
        self.app.use(express.session());
        
        self.app.use('/css', express.static(path.join(__dirname, '/css')));
        self.app.use('/img', express.static(path.join(__dirname, '/img')));
        self.app.use('/js', express.static(path.join(__dirname, '/js')));

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
        self.proxy = httpProxy.createProxyServer({target: 'http://api.themoviedb.org:80'});
     
         /* self.wss = new WebSocketServer({port:1337});

          self.wss.on('connection', function(ws) {
            ws.on('message', function(message) {
                console.log('received: %s', message);
                ws.send('Received: ' + message);
            });
            ws.send('something');
          });*/
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};



/**
 *  main():  Main code.
 */
var app = new BheemServer();
app.initialize();
app.start();

