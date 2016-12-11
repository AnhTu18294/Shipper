'use strict'
var modelFactory = require('../models/modelfactory.js');
var Notification = require('../entities/notification.js');

module.exports.getNotificationsByUserId = function(req, res){
	var userId = req.params.user_id;
	var role = req.params.role;

	console.log(req.params);

	var db = req.app.get('db');
	var notificationModel = modelFactory.createNotificationModel(db);

	notificationModel.getNotificationsByUserId(userId, role, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
};

module.exports.getNotificationsByUserIdAndStatus = function(req, res){
	var userId = req.params.user_id;
	var role = req.params.role;
	var status = req.params.status;

	var db = req.app.get('db');
	var notificationModel = modelFactory.createNotificationModel(db);

	notificationModel.getNotificationsByUserIdAndStatus(userId, role, status, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
};

module.exports.updateNotificationStatus = function(req, res){
	var db = req.app.get('db');
	var notificationModel = modelFactory.createNotificationModel(db);

	var notification_id = req.params.notification_id;
	var status = req.body.status;

	notificationModel.updateNotificationStatus(status, notification_id, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
}
