var config        = require('./config.js');
var socketServer  = require('./server/vws.socket.js').server;
var redis         = require('redis');
var getPort       = require('./argParser.js');
var Repo       = require('./repo.js').Repo;

config.port = getPort(process.argv);

var redisStore = redis.createClient();
var repo = new Repo(redisStore);

//All connected clients
var clients = [];

//Redis pub/sub.
var pub = redis.createClient();
var sub = redis.createClient();

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
    console.log(msg);
    // Broadcast the message to all connected clients on this server.
    clients.forEach(function(client) {
        if (channel === getChannel(msg)) {
            client.send(msg);
        }
    })
});

function getChannel (msg) {
    var message = JSON.parse(msg);
    return message.action.data[0].channel;
}

function getCommand (msg) {
    var message = JSON.parse(msg);
    return message.action.command;
}

socketServer( 'example', function ( client, server ) {

    client.on('open', function ( id ) {
        console.log('[open]');
        clients.push(client);
    });

    client.on('message', function ( msg ) {
        console.log('[message]');

        var channel = getChannel(msg.utf8Data);
        var command = getCommand(msg.utf8Data);

        if (command === "status") {
            sub.subscribe(channel);

            //TODO: send all stored messeges for the channel to client
            repo.getAllByCannel(channel, function(err, object) {
    			console.log(object);
    		})
        }
        if (command === "msg") {
            // Publish this message to the Redis pub/sub.
            pub.publish(channel, msg.utf8Data);

            //TODO: save into store
            //repo.add(channel, msg.utf8Data);
        }
    });

    client.on('error', function ( err ) {
        console.log(err);
    });

    client.on('close', function(){
        console.log('[close]');
        clients.splice(clients.indexOf(client), 1);
    });

}).config( config );
