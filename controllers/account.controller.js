var modelFactory = require('../models/modelfactory.js');
var Shipper = require('../entities/shipper.js');
var Store = require('../entities/store.js');
var Location = require('../entities/location.js');

module.exports.checkAccountExisted = function(req, res, next){
	var email = req.body.email;
	var role = req.body.role;

	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);

	accountModel.checkAccountExisted(email, role, function(err, message, data) {
		var output = {err: err, message: message, data: data}
		req.output = output;
		next();
	})
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
			account.phoneNumber = req.body.phoneNumber;
			account.address = req.body.address;
			account.birthday = req.body.birthday;
			account.longitude = req.body.longitude;
			account.latitude = req.body.latitude;
			account.createdTime = new Date();
			account.updatedTIme = new Date();
			
			accountModel.createShipperAccount(account, function(_err, _message, _data){
				var output = {
					error: _err,
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
			account.phoneNumber = req.body.phoneNumber;
			account.storeType = req.body.storeType;
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
					error: err,
					message: message,
					data: data
				};
				res.status(200).send(output);
			})
		}else{
			var output = {
				error: true,
				message: "Role Error !",
				data: null
			};
			res.send(output);
		}
	}else{
		var output = {
			error: true,
			message: "Email existed!",
			data: null
		};
		res.send(output);
		console.log("Email existed");
	}
}


