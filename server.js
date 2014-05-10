var WebSocketServer = require('ws').Server;
var http = require('http');

var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000


var server = http.createServer();

var  wss = new WebSocketServer({server:server})
console.log(wss);
wss.on('connection', function(ws) {
    console.log('/connection connected');
    ws.on('message', function(data, flags) {
        if (flags.binary) { return; }
        console.log('>>> ' + data);
        if (data == 'test') { console.log('test'); ws.send('got test'); }
        if (data == 'hello') { console.log('hello'); ws.send('WAZZZUP!'); }
    });
    ws.on('close', function() {
      console.log('Connection closed!');
    });
    ws.on('error', function(e) {
      console.log(e);
    });
});

wss.on('connect', function(ws) {
    console.log('/connect connected');
    ws.on('message', function(data, flags) {
        if (flags.binary) { return; }
        console.log('>>> ' + data);
        if (data == 'test') { console.log('test'); ws.send('got test'); }
        if (data == 'hello') { console.log('hello'); ws.send('WAZZZUP!'); }
    });
    ws.on('close', function() {
      console.log('Connection closed!');
    });
    ws.on('error', function(e) {
      console.log(e);
    });
});

console.log('Listening at IP ' + ipaddr +' on port '+port);
server.listen(port,ipaddr);