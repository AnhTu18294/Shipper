'use strict'

var RequestObserver = require('../observers/requestObserver.js');

var RequestModel = function(_db) {
    this.db = _db;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STORE CREATE REQUEST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

RequestModel.prototype.createRequest = function(_request, callback) {

    var query = 'INSERT INTO request(deposit, distance, start_time, end_time, store_id, destination, price, product_id, product_name, phone_number, longitude, latitude, status, created_time, updated_time, customer_name) ' + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ' + 'RETURNING id, deposit, distance, start_time, end_time, store_id, destination, price, product_id, product_name, phone_number, longitude, latitude, status, customer_name';
    var values = [_request.deposit, _request.distance, _request.startTime, _request.endTime, _request.storeId,
        _request.destination, _request.price, _request.productId, _request.productName, _request.phoneNumber,
        _request.longitude, _request.latitude, _request.status, _request.createdTime, _request.updatedTime, _request.customerName
    ];

    var createRequestSuccessful = function(data) {
        RequestObserver.emit('store-create-request', data);
        return callback(false, 'Create Success an request!', data);
    };

    var createRequestUnsuccesful = function(err) {
        console.log(err);
        return callback(true, 'There was some errors, CANNOT create an request!', err);
    };

    this.db.one(query, values)
        .then(createRequestSuccessful)
        .catch(createRequestUnsuccesful);
};

RequestModel.prototype.getRequestByStoreId = function(_storeId, callback) {
    var query = 'SELECT * FROM request WHERE store_id = $1';
    var values = [_storeId];

    var selectRequestSuccessful = function(data) {
        return callback(false, 'Select requests successful', data);
    };

    var selectRequestFailed = function(err) {
        return callback(true, 'Select requests failed!', err);
    };

    this.db.any(query, values)
        .then(selectRequestSuccessful)
        .catch(selectRequestFailed);
};

RequestModel.prototype.getRequestByIdStoreAndStatus = function(_storeId, _status, callback) {
    var query = 'SELECT * FROM request WHERE store_id = $1 AND status = $2';
    var values = [_storeId, _status];

    var selectRequestSuccessful = function(data) {
        return callback(false, 'Select requests successful', data);
    };

    var selectRequestFailed = function(err) {
        console.log(err);
        return callback(true, 'Select requests failed!', err);
    };

    this.db.any(query, values)
        .then(selectRequestSuccessful)
        .catch(selectRequestFailed);
};


// >>>>>>>>>>>>>> Change status of request <<<<<<<<<<<<<<<<<<<<<<

RequestModel.prototype.requireConfirmRequest = function(_requestId, callback) {
    
    var queryString = 'UPDATE request SET status = 3 WHERE id = $1 ' + 'RETURNING *';
    var values = [_requestId];

    var requireConfirmRequestError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT require confirm for request', null);
    };

    var requireConfirmRequestSuccessful = function(data) {
        return callback(false, 'Require confirm for request successful', data);
    };

    this.db.one(queryString, values)
        .then(requireConfirmRequestSuccessful)
        .catch(requireConfirmRequestError);
};

RequestModel.prototype.confirmCompletedRequest = function(_requestId, callback) {
    
    var queryString = 'UPDATE request SET status = 4 WHERE id = $1 ' + 'RETURNING *';
    var values = [_requestId];

    var confirmCompletedRequestError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT confirm Completed Request', null);
    };

    var confirmCompletedRequestSuccessful = function(data) {
        return callback(false, 'Confirm Completed Request successful', data);
    };

    this.db.one(queryString, values)
        .then(confirmCompletedRequestSuccessful)
        .catch(confirmCompletedRequestError);
};

// >>>>>>>>>>>>>>>>>>>>> Get 4 TAB Requests For Shipper <<<<<<<<<<<<<<

RequestModel.prototype.getLastestRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id AS request_id, request.price, request.destination, request.created_time, request.product_name, store.name, location.* '
                + 'FROM request, store, location '
                + 'WHERE (request.status = 0 OR request.status = 1) '
                + 'AND request.store_id = store.id ' 
                + 'AND store.location_id = location.id '
                + 'AND request.id '
                + 'NOT IN(SELECT request_id FROM response WHERE shipper_id = $1)'
                + 'ORDER BY request_id DESC ' 
                + 'LIMIT $2';
    
    var values = [_shipperId, _quantity];

    var getLastestRequestsError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT get Lastest requests for shipper', null);
    };

    var getLastestRequestsSuccessful = function(data) {
        console.log(data);
        return callback(false, 'Get Lastest requests successful', data);
    };

    this.db.any(query, values)
        .then(getLastestRequestsSuccessful)
        .catch(getLastestRequestsError);
}

RequestModel.prototype.getWaitingRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id AS request_id, request.price, request.destination, request.created_time, request.product_name, store.name, location.* FROM request, response, store, location ' 
                + 'WHERE (request.status = 0 OR request.status = 1) ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 0'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request_id DESC '
                + 'LIMIT $2';
    var values = [_shipperId, _quantity];

    var getWaitingRequestsError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT get Waiting requests for shipper', null);
    };

    var getWaitingRequestsSuccessful = function(data) {
        return callback(false, 'Get Waiting requests successful', data);
    };

    this.db.any(query, values)
        .then(getWaitingRequestsSuccessful)
        .catch(getWaitingRequestsError);
}

RequestModel.prototype.getProcessingRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id AS request_id, request.price, request.destination, request.status, request.created_time, request.product_name, store.name, location.* FROM request, response, store, location ' 
                + 'WHERE (request.status = 2 OR request.status = 3) ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 2'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request_id DESC ' 
                + 'LIMIT $2';
    var values = [_shipperId, _quantity];

    var getProcessingRequestsError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT get Processing requests for shipper', null);
    };

    var getProcessingRequestsSuccessful = function(data) {
        return callback(false, 'Get Processing requests successful', data);
    };

    this.db.any(query, values)
        .then(getProcessingRequestsSuccessful)
        .catch(getProcessingRequestsError);
}

RequestModel.prototype.getCompletedRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id AS request_id, request.price, request.destination, request.status, request.created_time, request.product_name, store.name, location.* FROM request, response, store, location ' 
                + 'WHERE request.status = 4 ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 2'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request_id DESC ' 
                + 'LIMIT $2';
    var values = [_shipperId, _quantity];

    var getCompletedRequestsError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT get Completed requests for shipper', null);
    };

    var getCompletedRequestsSuccessful = function(data) {
        return callback(false, 'Get Completed requests successful', data);
    };

    this.db.any(query, values)
        .then(getCompletedRequestsSuccessful)
        .catch(getCompletedRequestsError);
}

module.exports = RequestModel;