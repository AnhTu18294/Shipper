'use strict'
var modelFactory = require('../models/modelfactory.js');
var Request = require('../entities/request.js');

module.exports.createRequest = function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);

	var request = new Request();
	request.deposit = req.body.deposit;
	request.distance = req.body.distance;
	request.startTime = new Date(req.body.start_time); //  new Date('2016/12/03 22:05:00')
	request.endTime = new Date(req.body.end_time);  //  -> create time with timezone
	request.storeId = req.body.store_id;
	request.destination = req.body.destination;
	request.price = req.body.price;
	request.productName = req.body.product_name;
	request.phoneNumber = req.body.phone_number;
	request.longitude = req.body.longitude;
	request.latitude = req.body.latitude;
	if((req.body.status != null) && (req.body.status != undefined)){
		request.status = req.body.status;
	}
	request.createdTime = new Date();	// created time with timezone
	request.updatedTime = new Date();	//  creard time with timezone
	request.customerName = req.body.customer_name;

	requestModel.createRequest(request, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
};

module.exports.getRequestByIdStore = function(req, res){
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);

	var storeId = req.params.storeId;

	requestModel.getRequestByStoreId(storeId, function(err, message, data){
		res.json({err: err, message: message, data: data});
	})
};

module.exports.getRequestByIdStoreAndStatus = function(req, res){
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);

	var storeId = req.params.storeId;
	var status = req.params.status;
	
	requestModel.getRequestByIdStoreAndStatus(storeId, status, function(err, message, data){
		res.json({err: err, message: message, data: data});
	})
};


module.exports.getRequestByRequestId = function(req, res){
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);

	var requestId = req.params.requestId;
	var shipperId = req.params.shipperId;
	
	requestModel.getRequestByRequestId(requestId, shipperId, function(err, message, data){
		res.json({err: err, message: message, data: data});
	})
};

// update status for request

module.exports.requireConfirmRequest = function(req, res){
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var requestId = req.params.requestId;
	var storeId = req.body.store_id;
	var newRate = req.body.new_rate;

	var input = {
		requestId: requestId,
		storeId: storeId,
		newRate: newRate
	}

	requestModel.requireConfirmRequest(input, function(err, message, data){
		res.json({err: err, message: message, data: data});
	})
}

module.exports.confirmCompletedRequest = function(req, res){
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var requestId = req.params.requestId;
	var shipperId = req.body.shipper_id;
	var newRate = req.body.new_rate;

	var input = {
		requestId: requestId,
		shipperId: shipperId,
		newRate: newRate
	}

	requestModel.confirmCompletedRequest(input, function(err, message, data){
		res.json({err: err, message: message, data: data});
	})
}

// load 4 tabs for shipper's home
module.exports.getLastestRequestsByShipper =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var shipperId = req.params.shipperId;
	var quantity = 20;

	requestModel.getLastestRequestsByShipper(shipperId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

module.exports.getWaitingRequestsByShipper =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var shipperId = req.params.shipperId;
	var quantity = 20;

	requestModel.getWaitingRequestsByShipper(shipperId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

module.exports.getProcessingRequestsByShipper =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var shipperId = req.params.shipperId;
	var quantity = 20;

	requestModel.getProcessingRequestsByShipper(shipperId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

module.exports.getCompletedRequestsByShipper =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var shipperId = req.params.shipperId;
	var quantity = 20;

	requestModel.getCompletedRequestsByShipper(shipperId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

// load 3 tabs for store's home

module.exports.getWaitingRequestsByStore =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var storeId = req.params.storeId;
	var quantity = 20;
	requestModel.getWaitingRequestsByStore(storeId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

module.exports.getProcessingRequestsByStore =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var storeId = req.params.storeId;
	var quantity = 20;

	requestModel.getProcessingRequestsByStore(storeId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}

module.exports.getCompletedRequestsByStore =function(req, res) {
	var db = req.app.get('db');
	var requestModel = modelFactory.createRequestModel(db);
	var storeId = req.params.storeId;
	var quantity = 20;

	requestModel.getCompletedRequestsByStore(storeId, quantity, function(err, message, data){
		res.json({err:err, message: message, data: data});
	});
}