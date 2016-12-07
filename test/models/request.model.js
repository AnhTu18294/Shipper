var RequestModel = require('../../models/request.model.js');
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

var requestModel = new RequestModel(db);

