var modelFactory = require('../models/modelfactory.js');
var objectFactory = require('../lib/models/objectfactory.js');

module.exports.getAnAccountById = function(req, res){
	var accountId = req.params.account_id;
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	accountModel.findById(accountId, function(err, data){
		if(err){
			res.status(500).send("Error on server: \n" + data);
		}else{
			res.status(200).send(data)
		}
	});
};

module.exports.insertAnAccount = function(req, res){
	var account = objectFactory.createAccount();
	var db = req.app.get('db');
	var accountModel = modelFactory.createAccountModel(db);
	account.setEmail(req.body.email);	
	account.setUserName(req.body.user_name);
	account.setPassword(req.body.password);
	account.setRole(req.body.role);

	// should I need some code to verify email here?
	
	accountModel.insertAnAccount(account, function(err, data){
		if(err){
			return res.status(500).send("Error on server: \n" + data);
		}else{
			res.status(201).send(data);
		}
	});
};