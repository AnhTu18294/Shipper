'use strict'
var express = require('express');
var config = require('./configs/config.js');
var postgresConfig = config.postgresql;
var options = {
    error: function(error, e) {
        if (e.cn) {
            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);
        }
    }
};
var pgp = require('pg-promise')(options);
var db = pgp(postgresConfig);

var app = express();
var http = require('http').Server(app);
// config socket
var SocketIO = require('./socket/socket.io.js');
SocketIO.initSocket(http);
SocketIO.configSocket(db);

// config express app
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('db', db);

require('./routers/api.js')(app);

http.listen(app.get('port'), function() {
    console.log("server started on http://localhost:" + app.get('port') + ";\n please press Ctrl+C to terminate");
});
