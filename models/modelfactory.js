'use strict'

var AccountModel = require('./account.model.js');
var RequestModel = require('./request.model.js');
var LocationModel = require('./location.model.js');


module.exports.createAccountModel = function(db){
	return new AccountModel(db);
};

module.exports.createRequestModel = function(db){
	return new RequestModel(db);
};

module.exports.createLocationModel = function(db){
	return new LocationModel(db);
}

