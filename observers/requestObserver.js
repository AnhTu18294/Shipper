'use strict'
var EventEmitter = require('events');
var RequestObserver = new EventEmitter();

RequestObserver.on('store-create-request', function(data){
	console.log('someone has just created a request');
	console.log(data);
});

module.exports = RequestObserver;