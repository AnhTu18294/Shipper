'use strict'
var SocketModel = require('../../models/socket.model.js');

module.exports.configSocket = function(http, db) {
    var socketModel = new SocketModel(db);

    // Listen connection
    io.on('connection', function(socket) {
        var userId = socket.handshake.query.user_id;
        var role = socket.handshake.query.role;
        var socketId = socket.id;
        socketModel.insertConnectedSocket(userId, role, socketId, function(err, message, data) {
            console.log(message);
        });

        socket.on('disconnect', function() {
            socketModel.deleteDisconnectedSocket(socket.id, function(err, message, data) {
                console.log(message);
            })
        });

        socket.on('send-text', function(data) {
            socketModel.getConnectedSocketIdByUserId(data, 1, function(err, message, _data) {
                console.log('---------');
                console.log(_data);
                io.sockets.sockets[_data.socket_id].emit('reply-text', 'ahihi');
            })
        });

    });
}