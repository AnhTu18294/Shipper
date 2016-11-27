var EventEmitter = require('events');
var AccountObserver = new EventEmitter();

AccountObserver.on('create-shipper-account', function(data){
	console.log('someone has just created a shipper account');
	console.log(data);
});

AccountObserver.on('create-store-account', function(data){
	console.log('someone has just created a store account');
	console.log(data);
});

module.exports = AccountObserver;