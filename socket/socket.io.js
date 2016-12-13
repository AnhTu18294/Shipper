'use strict'
var SocketModel = require('../models/socket.model.js');
var io = undefined;
var SHIPPER = 1;
var STORE = 2
module.exports.initSocket = function(http){
	io = require('socket.io')(http);
};

module.exports.getSocketIO = function(){
	return io;
};

module.exports.configSocket = function(db) {
    var socketModel = new SocketModel(db);
    // Listen connection
    io.on('connection', function(socket) {
        var userId = socket.handshake.query.user_id;
        var role = socket.handshake.query.role;
        var socketId = socket.id;
        console.log(socket.handshake.query);
        console.log(io.sockets.sockets);
        socketModel.insertConnectedSocket(userId, role, socketId, function(err, message, data) {
            console.log(message);
        });

        socket.on('disconnect', function() {
            socketModel.deleteDisconnectedSocket(socket.id, function(err, message, data) {
                console.log(message);
            })
        });

        if(role == SHIPPER){
            require('./socket.shipper.js')(socket, db);
        }else{
            require('./socket.store.js')(socket, db);
        };

    });
}