var AccountModel = require('../../models/account.model.js');
var Shipper = require('../../entities/shipper.js');
var Store = require('../../entities/store.js');
var Location = require('../../entities/location.js');
var config = require('../../configs/config.js');

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
// console.log(cn);
var db = pgp(cn);

var accountModel = new AccountModel(db);

var account = new Shipper();

var fs = require('fs');

var base64Str = fs.readFileSync('../lib/utils/decodedImage.txt', 'utf8');

account.email = '12@gmail.com';
account.password = '12@gmail.com';
account.name = 'AnhTu';
account.phoneNumber = '9087654321';
account.address = 'Tan Mai, Hoang Mai, Ha Noi';
account.birthday = '1994-02-18';
account.longitude = 12;
account.latitude = 12;
account.createdTime = new Date();
account.updatedTIme = new Date();

accountModel.createShipperAccount(account, function(err, message, data){
	console.log(err);
	console.log(message);
	// console.log(data);
});

// console.log(__dirname);

// var account1 = new Store();

// account1.email = '1@gmail.com';
// account1.password = '1@gmail.com';
// account1.name = 'jaybo';
// account1.phoneNumber = '0123456789';
// account1.storeType = "Clothes";
// account1.address = 'Tan Mai, Hoang Mai, Ha Noi';
// account1.createdTime = new Date();
// account1.updatedTIme = new Date();
// var location = new Location();
// location.country = "Viet nam";
// location.city = "Ha Noi";
// location.district = "Hai Ba Trung";
// location.street = "Nguyen An Ninh";
// location.longitude = 100.5;
// location.latitude = 10.6;
// accountModel.createStoreAccount(account1, location, function(err, message, data){
// 	console.log("Error:" + err);
// 	console.log(message);
// 	console.log(data);
// });
// accountModel.checkAccountExisted('123@gmail.com', 1, function(err, message, result){
// 		console.log(err + ' | ' + message + ' | ' + result);
// }); 



//-------
