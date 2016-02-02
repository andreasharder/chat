var config        = require('./config.js');
var socketServer  = require('./server/vws.socket.js').server;
var redis         = require('redis');
var getPort       = require('./argParser.js');
var Repo      = require('./repo.js');

config.port = getPort(process.argv);

//All connected clients
var clients = [];

//Redis pub/sub.
var pub = redis.createClient();
var sub = redis.createClient();

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
    // Broadcast the message to all connected clients on this server.
    clients.forEach(function(client) {
        console.log(msg);
        if (channel === getChannel(msg)) {
            client.send(msg);
        }
    })
});

function getChannel (msg) {
    var message = JSON.parse(msg);
    return message.action.data[0].channel;
}

socketServer( 'example', function ( client, server ) {

    client.on('open', function ( id ) {
        console.log('[open]');
        clients.push(client);
    });

    client.on('message', function ( msg ) {
        console.log('[message]');

        var channel = getChannel(msg.utf8Data);

        sub.subscribe(channel);

        // Publish this message to the Redis pub/sub.
        pub.publish(channel, msg.utf8Data);
    });

    client.on('error', function ( err ) {
        console.log(err);
    });

    client.on('close', function(){
        console.log('[close]');
        clients.splice(clients.indexOf(client), 1);
    });

}).config( config );
