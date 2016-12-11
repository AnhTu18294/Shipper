'use strict'
var NotificationModel = require('../models/notification.model.js');
var Notification = require('../entities/notification.js');
var SocketModel = require('../models/socket.model.js');
var SocketIO = require('./socket.io.js');
var async = require('async');

var STORE_ACCEPT_SHIPPER = 4;
var STORE_CONFIRM_REQUEST_COMPELETED = 5;
var STORE_CANCEL_ACCEPTED_REQUEST =6;
var STORE_ACCEPT_ANOTHER_SHIPPER = 7;

var SHIPPER = 1;
var STORE = 2;


module.exports = function(_socket, _db){

	var notificationModel = new NotificationModel(_db);
	var socketModel = new SocketModel(_db);

//>>>>>>>>>>>>>>>>>STORE ACCEPT SHIPPER<<<<<<<<<<<<<<<<<<<<<<<<<<<
	_socket.on('store-accept-shipper', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = STORE_ACCEPT_SHIPPER;
		newNotification.actor_name = eventData.store_name;
		newNotification.actor_id = eventData.store_id;
		newNotification.actor_role = STORE;
		newNotification.receiver_name = eventData.shipper_name;
		newNotification.receiver_id = eventData.shipper_id;
		newNotification.receiver_role = SHIPPER;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.shipper_id, SHIPPER, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('store-accept-shipper', notification);
					}else{
						console.log(eventData.shipper_name + ": " + message);
					}
				});
			}			
		});		

	});
	
	_socket.on('store-accept-another-shipper', function(eventData){
		console.log(eventData);
		var listShipperWasRejected = eventData.list_shipper_was_rejected;
		if(listShipperWasRejected == null || undefined){
			console.log('Have no shipper who was rejected');
		}else{
			async.each(listShipperWasRejected, function(shipper, callback){
				var newNotification = new Notification();
				newNotification.created_time = new Date();
				newNotification.updated_time = new Date();
				newNotification.code = STORE_ACCEPT_ANOTHER_SHIPPER;
				newNotification.actor_name = eventData.store_name;
				newNotification.actor_id = eventData.store_id;
				newNotification.actor_role = STORE;
				newNotification.receiver_name = shipper.name;
				newNotification.receiver_id = shipper.id;
				newNotification.receiver_role = SHIPPER;
				newNotification.request_id = eventData.request_id;

				notificationModel.createNotification(newNotification, function(err, message, notification){
					if(err){
						console.log(message);						
					}else{
						socketModel.getConnectedSocketIdByUserId(shipper.id, SHIPPER, function(err, message, socket){
							if(!err){
								SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('store-accept-another-shipper', notification);
							}else{
								console.log(eventData.store_name + ": " + message);
							}
						});
					}
					callback();			
				});

			}, function(err){
				_socket.emit('ERROR-cannot-create-notification', notification);
			});
		}
	});
//>>>>>>>>>>>>>>>>>>>>>>>>CONFIRM REQUEST COMPELETED<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	_socket.on('store-confirm-request-compeleted', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = STORE_CONFIRM_REQUEST_COMPELETED;
		newNotification.actor_name = eventData.store_name;
		newNotification.actor_id = eventData.store_id;
		newNotification.actor_role = STORE;
		newNotification.receiver_name = eventData.shipper_name;
		newNotification.receiver_id = eventData.shipper_id;
		newNotification.receiver_role = SHIPPER;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.shipper_id, SHIPPER, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('store-confirm-request-compeleted', notification);
					}else{
						console.log(eventData.store_name + ": " + message);
					}
				});
			}			
		});	
	});


// >>>>>>>>>>>>>>>>>>>>>>>> STORE CANCEL REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	_socket.on('store-cancel-accepted-request', function(eventData){
		console.log(eventData);
		var newNotification = new Notification();
		newNotification.created_time = new Date();
		newNotification.updated_time = new Date();
		newNotification.code = STORE_CANCEL_ACCEPTED_REQUEST;
		newNotification.actor_name = eventData.store_name;
		newNotification.actor_id = eventData.store_id;
		newNotification.actor_role = STORE;
		newNotification.receiver_name = eventData.shipper_name;
		newNotification.receiver_id = eventData.shipper_id;
		newNotification.receiver_role = SHIPPER;
		newNotification.request_id = eventData.request_id;

		notificationModel.createNotification(newNotification, function(err, message, notification){
			if(err){
				console.log(message);
				_socket.emit('ERROR-cannot-create-notification', notification);		
			}else{
				socketModel.getConnectedSocketIdByUserId(eventData.shipper_id, SHIPPER, function(err, message, socket){
					if(!err){
						SocketIO.getSocketIO().sockets.sockets[socket.socket_id].emit('store-cancel-accepted-request', notification);
					}else{
						console.log(eventData.store_name + ": " + message);
					}
				});
			}			
		});	
			
	});	
};

