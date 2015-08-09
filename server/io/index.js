'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {

    if (io) return io;

    io = socketio(server);

    io.on('connection', function () {
        // Now have access to socket, wowzers!
        console.log("socket connection");
    });

    io.on('disconnect', function () {
    	//do stuff on disconnect
    	console.log("socket disconnected: send alerts");

	});
    
    return io;

};
