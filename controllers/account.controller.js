'use strict'
var modelFactory = require('../models/modelfactory.js');
var Shipper = require('../entities/shipper.js');
var Store = require('../entities/store.js');
var Location = require('../entities/location.js');

module.exports.checkAccountExisted = function(req, res, next){
	var email = req.body.email;
	var role = req.body.role;

	if((role == undefined) || (email == undefined)){
		var output = {
			err: true,
			message: "ERROR: Require a role and an email in request",
			data: null
		};
		res.send(output);
	}

	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);

	accountModel.checkAccountExisted(email, role, function(err, message, data) {
		var output = {err: err, message: message, data: data}
		req.output = output;
		next();
	});	
};

module.exports.createAccount = function(req, res){
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	if(req.output.data){
		// CREATE SHIPPER ACCOUNT
		if(req.body.role == 1){
			var account = new Shipper();

			account.email = req.body.email;
			account.password = req.body.password;
			account.name = req.body.name;
			account.phoneNumber = req.body.phone_number;
			account.address = req.body.address;
			account.birthday = req.body.birthday;
			account.longitude = req.body.longitude;
			account.latitude = req.body.latitude;
			account.createdTime = new Date();
			account.updatedTIme = new Date();
			// if request contains an image
			if((req.body.imageExtension != undefined) &&(req.body.imageBase64String != undefined)){
				account.imageExtension = req.body.image_extension;
				account.imageBase64String = req.body.image_base64string;
			}
			
			accountModel.createShipperAccount(account, function(_err, _message, _data){
				var output = {
					err: _err,
					message: _message,
					data: _data
				};
				res.status(200).send(output);
			});
		}else if(req.body.role == 2){
			// CREATE STORE ACCOUNT
			var account = new Store();
			account.email = req.body.email;
			account.password = req.body.password;
			account.name = req.body.name;
			account.phoneNumber = req.body.phone_number;
			account.storeType = req.body.store_type;
			account.address = req.body.address;
			account.createdTime = new Date();
			account.updatedTIme = new Date();

			var location  =  new Location();
			location.country = req.body.country;
			location.city = req.body.city;
			location.district = req.body.district;
			location.street = req.body.street;
			location.longitude = req.body.longitude;
			location.latitude = req.body.latitude;

			accountModel.createStoreAccount(account, location, function(err, message, data){
				var output = {
					err: err,
					message: message,
					data: data
				};
				res.status(200).send(output);
			});
		}else{
			var output = {
				err: true,
				message: "Role Error !",
				data: null
			};
			res.send(output);
		}
	}else{
		var output = {
			err: true,
			message: "Email existed!",
			data: null
		};
		res.send(output);
		console.log("Email existed");
	}
}

module.exports.loginAccount = function(req, res) {
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	var output = undefined;
	var loginInput = {
		email : req.body.email,
		password : req.body.password,
		role : req.body.role
	};
	console.log(loginInput);
	accountModel.loginAccount(loginInput , function (err, message, data){
		output = {err: err, message: message, data};
		res.send(output);
	});
}

module.exports.activeAccount = function(req, res){
	var role = req.body.role;
	var accountId = req.body.account_id;
	var activeCode = req.body.active_code;
	var db = req.app.get('db');
	var output = undefined;
	var accountModel = modelFactory.createAccountModel(db);
	console.log(req.body);

	accountModel.activeAccount(role, accountId, activeCode, function (err, message, data){
		output = {err: err, message: message, data};
		var output = {err: err, message: message, data: data}
		res.send(output);
	});
}

module.exports.requireResetPassword = function(req, res){
	console.log(req.body);
	var role = req.body.role;
	var email = req.body.email;
	var db = req.app.get('db');
	var output = undefined;
	var accountModel = modelFactory.createAccountModel(db);

	accountModel.requireResetPassword(role, email, function(err, message, data){
		output = {err: err, message: message, data};
		res.send(output);
	});
}

module.exports.checkResetCodeAndUpdatePassword = function(req, res){
	var role = req.body.role;
	var email = req.body.email;
	var resetCode = req.body.reset_code;
	var password = req.body.password;
	var db = req.app.get('db');
	var output = undefined;
	var accountModel = modelFactory.createAccountModel(db);

	accountModel.checkResetCodeAndUpdatePassword(role, email, resetCode, password, function(err, message, data){
		output = {err: err, message: message, data};
		res.send(output);
	});
}

module.exports.getShipper = function(req, res){
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	var shipperId = req.params.shipperId;

	accountModel.getShipper(shipperId, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
}

module.exports.getStore = function(req, res){
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	var storeId = req.params.storeId;

	accountModel.getStore(storeId, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
}

module.exports.updateProfile = function(req, res){
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);

	var input = {
		role: req.body.role,
		idAccount: req.body.account_id,
		name: req.body.name,
		phoneNumber: req.body.phone_number,
		address: req.body.address,
		birthday: req.body.birthday,
		storeType: req.body.store_type,
		city: req.body.city,
		street: req.body.street,
		country: req.body.country,
		district: req.body.district
	}

	accountModel.updateProfile(input, function(err, message, data){
		res.json({err: err, message: message, data: data});
	});
}


