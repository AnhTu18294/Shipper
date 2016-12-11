'use strict'

var NOT_SEEN = 0;
var SEEN = 1;

var Notification = function(){
	this.id = undefined;
	this.created_time = undefined;
	this.updated_time = undefined;
	this.code = undefined;
	this.actor_name = undefined;
	this.actor_id = undefined;
	this.actor_role = undefined;
	this.receiver_name = undefined;
	this.receiver_id = undefined;
	this.receiver_role = undefined;
	this.status = NOT_SEEN;
	this.request_id = undefined;
};

module.exports = Notification;

/*
status:{
	NOT SEEN : 0,
	SEEN: 1
}  
code:{
	1: shipper apply request,
	2: store accept shipper,
	3: store reject list shipper for request,

} 

*/