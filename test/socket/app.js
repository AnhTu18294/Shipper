var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SocketModel = require('../../models/socket.model.js');

var config = require('../../configs/config.js');

var options = {
    error: function (error, e) {
        if (e.cn) {            
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }
};

var pgp = require('pg-promise')(options);
var cn  = config.postgresql;
var db = pgp(cn);

var socketModel = new SocketModel(db);

io.on('connection', function(socket){
	var userId = socket.handshake.query.user_id;
	var role = socket.handshake.query.role;
	var socketId = socket.id;
	socketModel.insertConnectedSocket(userId, role, socketId, function(err, message, data){
		console.log(message);
	});

	socket.on('disconnect', function(){
		socketModel.deleteDisconnectedSocket(socket.id, function(err, message, data){
			console.log(message);
		})
	});

	socket.on('send-text', function(data){
		socketModel.getConnectedSocketIdByUserId(data, 1, function(err, message, _data){
			console.log('---------');
			console.log(_data);
			io.sockets.sockets[_data.socket_id].emit('reply-text','ahihi');
		})
	})

})


app.set('port', process.env.PORT || 8000);

http.listen(app.get('port'), function() {
    console.log("server started on http://localhost:" + app.get('port') + ";\n please press Ctrl+C to terminate");
});