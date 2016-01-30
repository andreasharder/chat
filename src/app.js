var config        = require('./config.js');
var socketServer  = require('./server/vws.socket.js').server;
var redis         = require('redis');

process.argv.forEach(function (val, index, array) {
    if (val.indexOf("port=") > -1) {
        var portString = val.substring(5);
        var portNumber = parseInt(portString, 10);
        if (portNumber == portString) {
            config.port = portNumber;
        }
    }
});

//All connected clients
var clients = [];

//Redis pub/sub.
var pub = redis.createClient();
var sub = redis.createClient();

sub.subscribe('global');

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
    // Broadcast the message to all connected clients on this server.
    clients.forEach(function(client) {
        console.log(msg);
        client.send(msg);
    })
});

socketServer( 'example', function ( client, server ) {

    client.on('open', function ( id ) {
        console.log('[open]');
        clients.push(client);
    });

    client.on('message', function ( msg ) {
        console.log('[message]');
        // Publish this message to the Redis pub/sub.
        pub.publish('global', msg.utf8Data);
    });

    client.on('error', function ( err ) {
        console.log(err);
    });

    client.on('close', function(){
        console.log('[close]');
        clients.splice(clients.indexOf(client), 1);
    });

}).config( config );
