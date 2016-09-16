'use strict'
var AccountModel = require('./account.model.js');
var LocationModel = require('./location.model.js');
var RequestModel = require('./request.model.js');

module.exports.createAccountModel = function(db){
	return new AccountModel(db);
};

module.exports.createLoactionModel = function(db){
	return new LocationModel(db);
};

module.exports.createRequestModel = function(db){
	return new RequestModel(db);
};

