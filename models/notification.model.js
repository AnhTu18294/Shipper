'use strict'

var NotificationModel = function(_db) {
    this.db = _db;
};

NotificationModel.prototype.getNotificationsByUserId = function(_userId, _role, callback){
	var query = 'SELECT * FROM notification WHERE receiver_id = $1 AND receiver_role = $2 ORDER BY updated_time DESC';
	var values = [_userId, _role];
	
	var getNotificationSuccessful = function(data){
		return callback(false, 'Get notifications done!', data);
	};

	var getNotificationFailed = function(err){
		console.log(err);
		return callback(true, 'Get notifications failed!', null);
	};
	this.db.any(query, values)
		.then(getNotificationSuccessful)
		.catch(getNotificationFailed);
};

NotificationModel.prototype.getNotificationsByUserIdAndStatus = function(_userId, _role, _status, callback){
	var query = 'SELECT * FROM notification WHERE receiver_id = $1 AND receiver_role = $2 AND status = $3 ORDER BY updated_time DESC';
	var values = [_userId, _role, _status];

	var getNotificationSuccessful = function(data){
		return callback(false, 'Get notifications done!', data);
	};

	var getNotificationFailed = function(err){
		console.log(err);
		return callback(true, 'Get notifications failed!', null);
	};

	this.db.any(query, values)
		.then(getNotificationSuccessful)
		.catch(getNotificationFailed);
};

NotificationModel.prototype.createNotification = function(_notification, callback){
	var query = 'INSERT INTO notification(created_time, updated_time, code, actor_id, actor_name, actor_role, receiver_name, receiver_id, receiver_role, status, request_id) '
			  + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) '
			  + 'RETURNING *';
    var values = [_notification.created_time, _notification.updated_time, _notification.code, _notification.actor_id,
    			  _notification.actor_name, _notification.actor_role, _notification.receiver_name, _notification.receiver_id,
    			  _notification.receiver_role, _notification.status, _notification.request_id];
    	  
    var createNotificationSuccessful = function(data) {
        return callback(false, 'Create Success a notification!', data);
    };

    var createNotificationUnsuccesful = function(err) {
        console.log(err);
        return callback(true, 'There was some errors, CANNOT create a notification!', null);
    };

    this.db.one(query, values)
        .then(createNotificationSuccessful)
        .catch(createNotificationUnsuccesful);
};

NotificationModel.prototype.updateNotificationStatus = function(_status, _id, callback){
	var query = 'UPDATE notification SET status = $1, updated_time = $2  WHERE id = $3 RETURNING *';
	var updatedTime = new Date();
	var values = [_status, updatedTime, _id];

	var updateSuccess = function(data){
		return callback(false, 'Update notification status Success', data);
	};
	var updateFailed = function(err){
		console.log(err);
		return callback(true, 'Update notification status Failed', null);
	}
	this.db.one(query, values)
		.then(updateSuccess)
		.catch(updateFailed);
};

module.exports = NotificationModel;