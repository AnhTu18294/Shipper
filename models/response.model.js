'use strict'

var ResponseObserver = require('../observers/responseObserver.js');

var ResponseModel = function(_db) {
    this.db = _db;
};

ResponseModel.prototype.createResponse = function(_response, callback) {
	var query =   'INSERT INTO response(request_id, shipper_id, status, created_time, updated_time) '
                + 'VALUES ($1, $2, $3, $4, $5) '
                + 'RETURNING request_id, shipper_id, status';
    var values  = [_response.requestId, _response.shipperId, _response.status, _response.createdTime, _response.updatedTime];
    
    var createResponseSuccessful = function(data) {
        ResponseObserver.emit('shipper-create-response',data);
        return callback(false, 'Create success a response!', data);
    };

    var createResponseUnsuccesful = function(err) {
    	console.log(err);
        return callback(true, 'There was some errors, CANNOT create a response!', err);
    };

    this.db.one(query, values)
        .then(createResponseSuccessful)
        .catch(createResponseUnsuccesful);
}

ResponseModel.prototype.getResponsesByRequestId = function(_requestId, callback) {
	var query = 'SELECT * FROM response WHERE request_id = $1';
	var values = [_requestId];

	var getResonsesSuccessful = function(data) {
        return callback(false, 'Get responses of request successful!', data);
    };

    var getResponsesUnsuccesful = function(err) {
    	console.log(err);
        return callback(true, 'There was some errors, CANNOT get responses of request!', err);
    };

    this.db.any(query, values)
        .then(getResonsesSuccessful)
        .catch(getResponsesUnsuccesful);
}

ResponseModel.prototype.getResponsesByShipperId = function(_shipperId, callback) {
	var query = 'SELECT * FROM response WHERE shipper_id = $1';
	var values = [_shipperId];

	var getResonsesSuccessful = function(data) {
        return callback(false, 'Get responses of shipper successful!', data);
    };

    var getResponsesUnsuccesful = function(err) {
    	console.log(err);
        return callback(true, 'There was some errors, CANNOT get responses of shipper!', err);
    };

    this.db.any(query, values)
        .then(getResonsesSuccessful)
        .catch(getResponsesUnsuccesful);
}


ResponseModel.prototype.acceptResponse = function(_input, callback){

	var acceptResponseSuccessful = function(data) {
		ResponseObserver.emit('store-accept-response',data);
        return callback(false, 'Accept response of shipper successful!', data);
    };

    var acceptResponseUnsuccesful = function(err) {
    	console.log(err);
        return callback(true, 'There was some errors, CANNOT accept response of shipper!', err);
    };

	this.db.tx(function (t) {
		var values = [_input.requestId,_input.shipperId];
    	var q1 = this.one('UPDATE response SET status = 2 WHERE request_id = $1 AND shipper_id = $2 RETURNING id, request_id, shipper_id, status', values);
    	var q2 = this.any('UPDATE response SET status = 1 WHERE request_id = $1 AND shipper_id <> $2 RETURNING id, request_id, shipper_id, status', values);
      
	    return this.batch([q1, q2]); 
	})
    .then(acceptResponseSuccessful)
    .catch(acceptResponseUnsuccesful);
}

ResponseModel.prototype.cancelResponse = function(_input, callback){
	if (_input.status == 0){
		var query = 'UPDATE response SET status = 1 WHERE request_id = $1 AND shipper_id = $2 RETURNING id, request_id, shipper_id, status';
		var values = [_input.requestId,_input.shipperId];

		var cancelResponseSuccessful = function(data) {
			ResponseObserver.emit('shipper-cancel-response',data);
	        return callback(false, 'Cancel response successful!', data);
    	};

	    var cancelResponseUnsuccesful = function(err) {
	    	console.log(err);
	        return callback(true, 'There was some errors, CANNOT cancel response!', err);
	    };
	    this.db.one(query,values)
	    .then(cancelResponseSuccessful)
	    .catch(cancelResponseUnsuccesful);
	}else if(_input.status == 2){
		return callback(true, 'CANNOT cancel this response which is accetep by store !', null);
	}else{
		return callback(true, 'This response has cancelled recently!', null);
	}
	
}

module.exports = ResponseModel;
