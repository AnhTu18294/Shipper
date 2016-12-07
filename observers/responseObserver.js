'use strict'
var EventEmitter = require('events');
var ResponseObserver = new EventEmitter();

ResponseObserver.on('shipper-create-response', function(data){
	console.log('a shipper has just created a response');
	console.log(data);
});

ResponseObserver.on('store-accept-response', function(data){
	console.log('store has just accepted a response');
	console.log(data);
});

ResponseObserver.on('shipper-cancel-response', function(data){
	console.log('shipper has just cancelled a response');
	console.log(data);
});

module.exports = ResponseObserver;