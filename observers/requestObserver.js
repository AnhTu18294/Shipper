'use strict'
var EventEmitter = require('events');
var RequestObserver = new EventEmitter();

RequestObserver.on('store-create-request', function(data){
	console.log('someone has just created a request');
	console.log(data);
});

RequestObserver.on('shipper-require-confirm-request', function(data){
	console.log('shipper has just required confirm a request');
	console.log(data);
});

RequestObserver.on('store-confirm-request', function(data){
	console.log('store has just confirmed a request');
	console.log(data);
});

RequestObserver.on('store-cancel-request', function(data){
	console.log('store has just cancel a request');
	console.log(data);
});

module.exports = RequestObserver;