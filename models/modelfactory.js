'use strict'

//var ShipperModel = require('./shipper.model.js');
var AccountModel = require('./account.model.js');

// module.exports.createShipperModel = function(db){
// 	return new ShipperModel(db);
// };

module.exports.createAccountModel = function(db){
	return new AccountModel(db);
}


