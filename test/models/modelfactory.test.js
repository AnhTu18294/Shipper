var modelFactory = require('../../models/modelfactory.js');
var Account = require('../../lib/models/account.js');
var config = require('../../configs/config.js');
var options = {
    error: function (error, e) {
        if (e.cn) {            
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }
};

var pgp = require('pg-promise')();
var cn  = config.postgresql;
// console.log(cn);
var db = pgp(cn);
// console.log(modelFactory);
// var modelFactory = new ModelFactory();
var accountModel = modelFactory.createAccountModel(db);
var account = new Account();

account.setEmail('hero123456@gmail.com')
	.setUserName('AnhTu123456789')
	.setPassword('toilaai')
	.setRole('store');

accountModel.insertAnAccount(account, function(err, data){
	console.log(data);
});