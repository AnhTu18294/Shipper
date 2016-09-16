'use strict'
var Account = require('./account.js');
var Location = require('./location.js');
var Request = require('./request.js');
var Response = require('./response.js');
var Shipper = require('./shipper.js');
var Store = require('./store.js');

module.exports.createAccount = function(){
	return new Account();
};

module.exports.createLocation = function(){
	return new Location();
};

module.exports.createRequest = function(){
	return new Request();
};

module.exports.createRespnse = function(){
	return new Response();
};

module.exports.createShipper = function(){
	return new Shipper();
};

module.exports.createStore = function(){
	return new Store();
};