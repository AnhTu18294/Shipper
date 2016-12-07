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

RequestModel.prototype.updateStatus = function(_requestId, _status, callback) {
    
    var queryString = 'UPDATE request SET status = $1 WHERE id = $2 ' + 'RETURNING *';
    var values = [_status, _requestId];

    var changeStatusError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT update status for request', null);
    };

    var changeStatusSuccessful = function(data) {
        return callback(false, 'Update status successful', data);
    };

    this.db.one(queryString, values)
        .then(changeStatusSuccessful)
        .catch(changeStatusError);
}

module.exports = RequestModel;