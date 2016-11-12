'use strict'

var ShipperModel = require('./shipper.model.js');

module.exports.createShipperModel = function(db){
	return new ShipperModel(db);
};


