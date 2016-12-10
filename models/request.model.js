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
// >>>>>>>>>>>>>> Get Full Information of Request <<<<<<<<<<<<<<<

RequestModel.prototype.getRequestByRequestId = function(_requestId, _shipperId, callback){
    var getRequestSuccessful = function(data) {
        var data1 = data[0];
        var data2 = data[1];
        console.log(data2);
        var output = {
            request: {
                id: data1.request_id,
                deposit: data1.deposit,
                distance: data1.distance,
                start_time: data1.start_time,
                end_time: data1.end_time,
                destination: data1.destination,
                price: data1.price,
                product_name: data1.product_name,
                phone_number: data1.request_phone_number,
                customer_name: data1.customer_name,
                address: data1.address,
                rating: data1.rating,
                vote: data1.vote,
                avatar: data1.avatar,
                longitude: data1.request_longitude,
                latitude: data1.request_latitude,
                status: data1.request_status
            },
            store: {
                id: data1.store_id,
                phone_number: data1.store_phone_number,
                name: data1.name,
                store_type: data1.store_type,
            },
            location: {
                id: data1.location_id,
                longitude: data1.longitude,
                latitude: data1.latitude,
                country: data1.country,
                city: data1.city,
                district: data1.district,
                street: data1.street,
            },
            response:{
                id: null,
                shipper_id: null,
                request_id: null,
                status: null
            }
        }

        if(data2.length > 0){
            output.response.id = data2[0].response_id;
            output.response.shipper_id = data2[0].shipper_id;
            output.response.request_id = data2[0].request_id;
            output.response.status = data2[0].response_status;
        }
        
        return callback(false, 'Get requests successful', output);
    };

    var getRequestFailed = function(err) {
        console.log(err);
        return callback(true, 'Get requests failed!', err);
    };

    this.db.tx(function (t) {
        var values = [_requestId, _shipperId];
        var q1 = this.one('SELECT request.id AS request_id, request.longitude AS request_longitude, request.latitude AS request_latitude, request.status AS request_status, request.*, request.phone_number AS request_phone_number, store.phone_number AS store_phone_number, location.*, store.* ' 
                            + 'FROM request, store, location '
                            + 'WHERE request.id = $1 AND request.store_id = store.id '
                            + 'AND store.location_id = location.id ', values[0]);
        var q2 = this.any('SELECT response.id AS response_id, response.status AS response_status, response.* '
                            + 'FROM response '
                            + 'WHERE response.request_id = $1 '
                            + 'AND response.shipper_id = $2 ' , values);
      
        return this.batch([q1, q2]); 
    })
    .then(getRequestSuccessful)
    .catch(getRequestFailed);
};

// >>>>>>>>>>>>>> Change status of request, rating shipper and store <<<<<<<<<<<<<<<<<<<<<

RequestModel.prototype.requireConfirmRequest = function(_input, callback) {
    
    //var queryString = 'UPDATE request SET status = 3 WHERE id = $1 ' + 'RETURNING *';

    var requireConfirmRequestError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT require confirm for request', null);
    };

    var requireConfirmRequestSuccessful = function(data) {
        RequestObserver.emit('shipper-require-confirm-request', data);
        return callback(false, 'Require confirm for request successful', data);
    };

    if(_input.newRate != 0){
        this.db.tx(function (t) {
            var newRating  = (_input.rating * _input.vote + _input.newRate)/(_input.vote + 1);
            var values_1 = [_input.requestId];
            var values_2 = [newRating, _input.storeId];
            var q1 = this.one('UPDATE request SET status = 3 WHERE id = $1 ' + 'RETURNING *', values_1);
            var q2 = this.one('UPDATE store SET rating = $1, vote = vote + 1  WHERE id = $2 RETURNING *', values_2);
          
            return this.batch([q1, q2]); 
        })
        .then(requireConfirmRequestSuccessful)
        .catch(requireConfirmRequestError);
    }else{
        var queryString = 'UPDATE request SET status = 3 WHERE id = $1 ' + 'RETURNING *';
        var values = [_input.requestId];
        this.db.one(queryString, values)
        .then(requireConfirmRequestSuccessful)
        .catch(requireConfirmRequestError);
    }
};

RequestModel.prototype.confirmCompletedRequest = function(_input, callback) {

    var confirmCompletedRequestError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT confirm Completed Request', null);
    };

    var confirmCompletedRequestSuccessful = function(data) {
        RequestObserver.emit('store-confirm-request', data);
        return callback(false, 'Confirm Completed Request successful', data);
    };

    if(_input.newRate != 0){
        this.db.tx(function (t) {
            var newRating  = (_input.rating * _input.vote + _input.newRate)/(_input.vote + 1);
            var values_1 = [_input.requestId];
            var values_2 = [newRating, _input.shipperId];
            var q1 = this.one('UPDATE request SET status = 4 WHERE id = $1 ' + 'RETURNING *', values_1);
            var q2 = this.one('UPDATE shipper SET rating = $1, vote = vote + 1  WHERE id = $2 RETURNING *', values_2);
          
            return this.batch([q1, q2]); 
        })
        .then(confirmCompletedRequestSuccessful)
        .catch(confirmCompletedRequestError);
    }else{
        console.log("hell");
        var queryString = 'UPDATE request SET status = 4 WHERE id = $1 ' + 'RETURNING *';
        var values = [_input.requestId];
        this.db.one(queryString, values)
        .then(confirmCompletedRequestSuccessful)
        .catch(confirmCompletedRequestError);
    }


    // this.db.one(queryString, values)
    //     .then(confirmCompletedRequestSuccessful)
    //     .catch(confirmCompletedRequestError);
};

// >>>>>>>>>>>>>>>>>>>>> Get 4 TAB Requests For Shipper <<<<<<<<<<<<<<

RequestModel.prototype.getLastestRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id, request.price, request.destination, request.created_time, request.product_name, store.id AS store_id, store.name, location.id AS location_id, location.country, location.district, location.city, location.street '
                + 'FROM request, store, location '
                + 'WHERE (request.status = 0 OR request.status = 1) '
                + 'AND request.store_id = store.id ' 
                + 'AND store.location_id = location.id '
                + 'AND request.id '
                + 'NOT IN(SELECT request_id FROM response WHERE shipper_id = $1)'
                + 'ORDER BY request.id DESC ' 
                + 'LIMIT $2';
    
    var values = [_shipperId, _quantity];

    var getLastestRequestsError = function(err) {
        console.log(err);
        return callback(true, 'CANNOT get Lastest requests for shipper', null);
    };

    var getLastestRequestsSuccessful = function(data) {
        return callback(false, 'Get Lastest requests successful', data);
    };

    this.db.any(query, values)
        .then(getLastestRequestsSuccessful)
        .catch(getLastestRequestsError);
}

RequestModel.prototype.getWaitingRequests = function(_shipperId, _quantity, callback){
    var query = 'SELECT request.id, request.price, request.destination, request.created_time, request.product_name,  store.id AS store_id, store.name, location.id AS location_id, location.country, location.district, location.city, location.street FROM request, response, store, location ' 
                + 'WHERE (request.status = 0 OR request.status = 1) ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 0'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request.id DESC '
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
    var query = 'SELECT request.id, request.price, request.destination, request.status, request.created_time, request.product_name,  store.id AS store_id, store.name, location.id AS location_id, location.country, location.district, location.city, location.street FROM request, response, store, location ' 
                + 'WHERE (request.status = 2 OR request.status = 3) ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 2'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request.id DESC ' 
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
    var query = 'SELECT request.id, request.price, request.destination, request.status, request.created_time, request.product_name,  store.id AS store_id, store.name, location.id AS location_id, location.country, location.district, location.city, location.street FROM request, response, store, location ' 
                + 'WHERE request.status = 4 ' 
                + 'AND request.id = response.request_id ' 
                + 'AND response.shipper_id = $1 '
                + 'AND response.status = 2'
                + 'AND request.store_id = store.id '
                + 'AND store.location_id = location.id ' 
                + 'ORDER BY request.id DESC '
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