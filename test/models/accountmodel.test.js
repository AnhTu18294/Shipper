var AccountModel = require('../../models/account.model.js');
var config = require('../../configs/config.js');
var Account = require('../../lib/models/account.js');
var options = {
    error: function (error, e) {
        if (e.cn) {            
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }
};

var pgp = require('pg-promise')(options);
var cn  = config.postgresql;
console.log(cn);
var db = pgp(cn);

var account = new Account();

account.setEmail('123456789@gmail.com')
	.setUserName('AnhTu131311')
	.setPassword('Password2')
	.setRole('shipper');

var accountModel = new AccountModel(db);

// accountModel.insertAnAccount(account, function(err, data){
// 	console.log(data);
// });
// // accountModel.findById(2, function(err, data){
// 	console.log(data);
// });

// account.setId(1);
// accountModel.updateUserNameById(account, function(err, data){
// 	console.log(data);
// });

// accountModel.updatePasswordById(account, function(err, data){
// 	console.log(data);
// });

// accountModel.deleteAnAccount(1,function(err, data){
// 	console.log(data);
// });


// var a = '12sds';
// if(!a){
// 	console.log('a bi null roi');
// }else{
// 	console.log('a co gia tri');
// }

// accountModel.isValidUserPassword('123@gmail.com', 'Password2123', function(result, message){
// 	console.log(message);
// })