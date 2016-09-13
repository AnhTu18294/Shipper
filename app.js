var config = require('./configs/config.js');
var Account = require('./lib/models/account.js');
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
var time = new Date();
console.log(time.getHours() + 'h:' + time.getMinutes() + 'm:' + time.getSeconds() + 's');
console.log(time);

var account = new Account();

account.email = '1@gmail.com';
account.store_id = '2';
account.status = '1';
account.start_time = time;
account.distance = 10;
// db.one("insert into films(name, date, kind, showtimes) values($1, $2, $3, $4)",['transformer 4', time, 'violent', time]).then(function(data){
// 	console.log(data);
// }).catch(function(err){
// 	console.log(err);
// });

// db.one("insert into accounts(email, store_id, price, status, start_time, distance) values($1, $2, $3, $4, $5, $6) returning id",[account.email, account.store_id, account.price, account.status, account.start_time, account.distance]).then(function(data){
// 	console.log(data);
// }).catch(function(err){
// 	console.log(err);
// });

// console.log('----------- db now -----------');
// db.any("select * from films where name = $1",['1 or 1=1']).then(function(data){
//  //    var time = data[0].showtimes;
// 	// console.log(time.getHours() + 'h:' + time.getMinutes() + 'm:' + time.getSeconds() + 's');
// 	console.log(data)
// }).catch(function(err){
// 	console.log(err);
// });

// db.one("delete from accounts where id = $1", [5]).then(function(result){
// 	console.log(result);
// }).catch(function(err){
// 	console.log(err);
// })

db.one("update accounts set email = $1, store_id = $2, price = $3 where id = $4 returning *",['ahihi@gmail.com', 3, 4, 4])
	.then(function(data){
		console.log(data);
	}).catch(function(err){
		console.log(err);
	});