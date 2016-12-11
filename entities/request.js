'use strict'

var WAITTING = 0;
var RESPONSED = 1;
var DOING = 2;
var WAITTING_CONFIRM = 3;
var COMPLETED = 4;
var CANCELED = 5;

var Request = function(){
	this.id = undefined;
	this.deposit = undefined;
	this.distance = undefined;
	this.startTime = undefined;
	this.endTime = undefined;
	this.storeId = undefined;
	this.destination = undefined;
	this.price = undefined;
	this.productId = undefined;
	this.productName = undefined;
	this.phoneNumber = undefined;
	this.longitude = undefined;
	this.latitude = undefined;
	this.status = WAITTING;
	this.createdTime = undefined;
	this.updatedTime = undefined;
	this.customerName = undefined;
};

module.exports = Request;

/* status:
0: vua tao, dang chua co phan hoi : waitting
1: da co it nhat mot phan hoi : responsed
2: da accept mot shipper cho nhiem vu : doing
3: nhiem vu hoan thanh, shipper gui phan hoi cho store confirm: 
4: store confirm nhiem vu da hoan thanh : compeleted
5: bi huy
*/

/*
date time with time zone
*/