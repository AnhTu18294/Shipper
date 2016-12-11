'use strict'
var NotificationModel = require('../../models/notification.model.js');
var Notification = require('../../entities/notification.js');
var SocketModel = require('../../models/socket.model.js');
var SocketIO = require('./socket.io.js');

var SHIPPER_APPLY_REQUEST = 1;
var SHIPPER_REQUIRE_CONFIRM_REQUEST_COMPELETED = 2;
var SHIPPER_CANCEL_ACCEPTED_REPSPONSE =3;

var SHIPPER = 1;
var STORE = 2;

module.exports = function(_socket, _db){
	var notificationModel = new NotificationModel(_db);
	var socketModel = new SocketModel(_db);

	_socket.on('shipper-apply-request', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = SHIPPER_APPLY_REQUEST;
		newNotification.actor_name = eventData.shipper_name;
		newNotification.actor_id = eventData.shipper_id;
		newNotification.actor_role = SHIPPER;
		newNotification.receiver_name = eventData.store_name;
		newNotification.receiver_id = eventData.store_id;
		newNotification.receiver_role = STORE;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);	
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.store_id, STORE, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('shipper-apply-request', notification);
					}else{
						console.log(eventData.store_name + ": " + message);
					}
				});
			}			
		});		

	});

	_socket.on('shipper-require-confirm-request-compeleted', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = SHIPPER_REQUIRE_CONFIRM_REQUEST_COMPELETED;
		newNotification.actor_name = eventData.shipper_name;
		newNotification.actor_id = eventData.shipper_id;
		newNotification.actor_role = SHIPPER;
		newNotification.receiver_name = eventData.store_name;
		newNotification.receiver_id = eventData.store_id;
		newNotification.receiver_role = STORE;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);	
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.store_id, STORE, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('shipper-require-confirm-request-compeleted', notification);
					}else{
						console.log(eventData.store_name + ": " + message);
					}
				});
			}			
		});
	});

	_socket.on('shipper-cancel-accepted-response', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = SHIPPER_CANCEL_ACCEPTED_REPSPONSE;
		newNotification.actor_name = eventData.shipper_name;
		newNotification.actor_id = eventData.shipper_id;
		newNotification.actor_role = SHIPPER;
		newNotification.receiver_name = eventData.store_name;
		newNotification.receiver_id = eventData.store_id;
		newNotification.receiver_role = STORE;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);	
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.store_id, STORE, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('shipper-cancel-accepted-response', notification);
					}else{
						console.log(eventData.store_name + ": " + message);
					}
				});
			}			
		});
	});
};
