'use strict'
var EventEmitter = require('events');
var AccountObserver = new EventEmitter();
var smtpTransporter = require('../lib/utils/mailer.js');
var sender = require('../configs/config.js').sender;

var ActiveCodeMail = require('../lib/mailcontents/sendactivecode.js');
var RequireResetCode = require('../lib/mailcontents/requireResetCode');

AccountObserver.on('create-shipper-account', function(data){
	console.log('someone has just created a shipper account');
	var htmlContent = ActiveCodeMail.createEmailContent(data);
	var mailOptions = {
		from: 'Shipper Community <' + sender.gmail + '>',
		to: data.email,
		subject: 'Active Code For Registration - Shipper Community',
		text: null,
		html: htmlContent
	}
	smtpTransporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}else{
			console.log(info);
		}
	})
});

AccountObserver.on('create-store-account', function(data){
	console.log('someone has just created a store account');
	var htmlContent = ActiveCodeMail.createEmailContent(data);
	var mailOptions = {
		from: 'Shipper Community <' + sender.gmail + '>',
		to: data.email,
		subject: 'Active Code For Registration - Shipper Community',
		text: null,
		html: htmlContent
	}
	smtpTransporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}else{
			console.log(info);
		}
	})
});


AccountObserver.on('require-reset-code', function(data){
	console.log('someone has just require to reset code for changing password');
	var htmlContent = RequireResetCode.createEmailContent(data);
	var mailOptions = {
		from: 'Shipper Community <' + sender.gmail + '>',
		to: data.email,
		subject: 'Reset Code For Changing Password - Shipper Community',
		text: null,
		html: htmlContent
	}
	smtpTransporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		}else{
			console.log(info);
		}
	})
});

module.exports = AccountObserver;