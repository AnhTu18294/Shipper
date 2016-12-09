var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
var db = pgp(cn);





app.set('port', process.env.PORT || 8000);

http.listen(app.get('port'), function() {
    console.log("server started on http://localhost:" + app.get('port') + ";\n please press Ctrl+C to terminate");
});