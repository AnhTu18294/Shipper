'use strict'

var ResponseObserver = require('../observers/responseObserver.js');

var ResponseModel = function(_db) {
    this.db = _db;
};

ResponseModel.prototype.createResponse = function(_response, callback) {
    var createResponseSuccessful = function(data) {
        ResponseObserver.emit('shipper-create-response',data);
        return callback(false, 'Create success a response!', data);
    };

    var createResponseUnsuccesful = function(err) {
    	console.log(err);
        return callback(true, 'There was some errors, CANNOT create a response!', err);
    };

    this.db.tx(function (t) {
        var values_1  = [_response.requestId, _response.shipperId, _response.status, _response.createdTime, _response.updatedTime];
        var values_2  = [_response.requestId];
        console.log(_response.requestId);
        var q1 = this.one('INSERT INTO response(request_id, shipper_id, status, created_time, updated_time) '
                            + 'VALUES ($1, $2, $3, $4, $5) '
                            + 'RETURNING request_id, shipper_id, status', values_1);
        var q2 = this.one('UPDATE request SET status = 1 WHERE id = $1 RETURNING *', values_2);
      
        return this.batch([q1, q2]); 
    })
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCEPT RESPONSE BY STORE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
        var q3 = this.one('UPDATE request SET status = 2 WHERE id = $1 RETURNING id, status', _input.requestId);
      
	    return this.batch([q1, q2, q3]); 
	})
    .then(acceptResponseSuccessful)
    .catch(acceptResponseUnsuccesful);
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LIST SHIPPER TO NOTIFY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

ResponseModel.prototype.getListShipperToNotify = function(_input, callback){
    var getListShipperToNotifySuccessful = function(data) {
        return callback(false, 'get List Shipper To Notify Successful', data);
    };

    var getListShipperToNotifyError = function(err) {
        console.log(err);
        return callback(true, 'get List Shipper To Notify Error!', err);
    };

    var query = 'SELECT DISTINCT ON(shipper.id) shipper.id, shipper.name FROM shipper, response, request '
                + 'WHERE shipper.id <> $2 AND response.shipper_id = shipper.id AND response.request_id = $1';
    var values = [_input.requestId,_input.shipperId];

    this.db.any(query, values)
        .then(getListShipperToNotifySuccessful)
        .catch(getListShipperToNotifyError);
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CANCEL RESPONSE BY SHIPPER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

ResponseModel.prototype.cancelResponse = function(_input, callback){
    var self = this;

    var getStatusFailed = function(err) {
        console.log(err);
        return callback(true, 'There was some errors, CANNOT get status of response!', err);
    };

    var next = function(data){

        var cancelResponseSuccessful = function(data) {
            ResponseObserver.emit('shipper-cancel-response',data);
            return callback(false, 'Cancel response successful!', data);
        };

        var cancelResponseUnsuccesful = function(err) {
            console.log(err);
            return callback(true, 'There was some errors, CANNOT cancel response!', err);
        };

        if (data.status == 0){
            var query = 'UPDATE response SET status = 3 WHERE request_id = $1 AND shipper_id = $2 RETURNING id, request_id, shipper_id, status';
            var values_1 = [_input.requestId,_input.shipperId];

            self.db.one(query,values_1)
            .then(cancelResponseSuccessful)
            .catch(cancelResponseUnsuccesful);

        }else if(data.status == 2){
            console.log("alo");
            self.db.tx(function (t) {
                var values_1 = [_input.requestId,_input.shipperId];
                var values_2 = [_input.shipperId];
                var q1 = t.one('UPDATE response SET status = 3 WHERE request_id = $1 AND shipper_id = $2 RETURNING id, request_id, shipper_id, status', values_1);
                var q2 = t.one('UPDATE shipper SET rating = (rating * vote + 1)/(vote + 1), vote = vote + 1  WHERE id = $1 RETURNING *', values_2);
              
                return t.batch([q1, q2]); 
            })
            .then(cancelResponseSuccessful)
            .catch(cancelResponseUnsuccesful);
        }else{
            return callback(true, 'This response has cancelled recently!', null);
        }
    }

    var query = 'SELECT status FROM response WHERE request_id = $1 AND shipper_id = $2';
    var values = [_input.requestId,_input.shipperId];

    this.db.one(query,values)
    .then(next)
    .catch(getStatusFailed);	
}

module.exports = ResponseModel;
