'use strict'

var modelFactory = require('../models/modelfactory.js');
var Response = require('../entities/response.js');

module.exports.createResponse = function(req, res) {
 	var db = req.app.get('db');
	var responseModel = modelFactory.createResponseModel(db);

	var response = new Response();
	response.requestId = req.body.request_id;
	response.shipperId = req.body.shipper_id;
	response.status = 0;
	response.createdTime = new Date();	// created time with timezone
	response.updatedTime = new Date();	//  creard time with timezone

	responseModel.createResponse(response, function(err, message, data) {
		res.json({err: err, message: message, data: data});	
	});
}

module.exports.getResponsesByRequestId = function(req, res) {
	var db = req.app.get('db');
	var responseModel = modelFactory.createResponseModel(db);

	var requestId = req.params.requestId;

	responseModel.getResponsesByRequestId(requestId, function(err, message, data) {
		res.json({err: err, message: message, data: data});
	});
}

module.exports.getResponsesByShipperId = function(req, res) {
	var db = req.app.get('db');
	var responseModel = modelFactory.createResponseModel(db);

	var shipperId = req.params.shipperId;

	responseModel.getResponsesByShipperId(shipperId, function(err, message, data) {
		res.json({err: err, message: message, data: data});
	});
}

module.exports.acceptResponse =  function(req, res) {
	var db = req.app.get('db');
	var responseModel = modelFactory.createResponseModel(db);

	var input = {
		requestId :req.body.request_id,
		shipperId : req.body.shipper_id
	}

	responseModel.acceptResponse(input, function(err, message, data) {
		res.json({err: err, message: message, data: data});
	});
}

module.exports.cancelResponse = function(req, res) {
	var db = req.app.get('db');
	var responseModel = modelFactory.createResponseModel(db);

	var input = {
		requestId :req.body.request_id,
		shipperId : req.body.shipper_id,
		status : req.body.status
	}

	responseModel.cancelResponse(input, function(err, message, data) {
		res.json({err: err, message: message, data: data});
	});
}
