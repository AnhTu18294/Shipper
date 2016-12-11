var NotificationModel = require('../../models/notification.model.js');
var Notification = require('../../entities/notification.js');

var config = require('../../configs/config.js');

var options = {
    error: function(error, e) {
        if (e.cn) {
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }
};

var pgp = require('pg-promise')(options);
var cn = config.postgresql;
// console.log(cn);
var db = pgp(cn);

var SHIPPER_APPLY_REQUEST = 1;
// var SHIPPER_CANCEL_RESPONSE = 3;

var SHIPPER = 1;
var STORE = 2;

var notificationModel = new NotificationModel(db);

var newNotification = new Notification();

var eventData = {
    shipper_name: 'Nguyen Anh Tu',
    shipper_id: 100,
    store_name: 'Smart Watch Store',
    store_id: 111
}

newNotification.created_time = new Date();
newNotification.updated_time = new Date();
newNotification.code = SHIPPER_APPLY_REQUEST;
newNotification.actor_name = eventData.shipper_name;
newNotification.actor_id = eventData.shipper_id;
newNotification.actor_role = SHIPPER;
newNotification.receiver_name = eventData.store_name;
newNotification.receiver_id = eventData.store_id;
newNotification.receiver_role = STORE;

notificationModel.createNotification(newNotification, function(err, message, data){
	console.log(message);
	console.log(data);
})