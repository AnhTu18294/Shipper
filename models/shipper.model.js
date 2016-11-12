'use strict'

var hashTool = require('../lib/utils/hash.js');

var ShipperModel = function(_db){
	this.db = _db;
};

ShipperModel.prototype.insertShipperAccount = function(_shipper, callback){

	var salt = hashTool.generateSaltRandom();
	var password = hashTool.hashPasswordWithSalt(_shipper.password, salt);

	_shipper.password = password;
	_shipper.salt = salt;

	var queryString = "INSERT INTO Shipper(email, password, salt, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, created_time, updated_time) "
					+ "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
	// var values = [_shipper.email, _shipper.password, _shipper.salt, _shipper.name, _shipper.phoneNumber, _shipper.address, _shipper.avatar, _shipper.birthday, _shipper.longitude, _shipper.latitude, _shipper.rating, _shipper.vote, _shipper.createdTime, _shipper.updatedTime];
	
	var values;
	delete _shipper.id;
	for(var propertyName in _shipper){
		values.push(_shipper[propertyName]);
	}

	var insertSuccessfulThenReturnAccountId = function(data) {
		console.log(data);
        return callback(false, data);
    };

    var insertUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(insertSuccessfulThenReturnShipperId)
        .catch(insertUnsuccesfulThenReturnErrorMessage);

}

module.exports = ShipperModel;
