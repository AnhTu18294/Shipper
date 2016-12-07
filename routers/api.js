'use strict'
var accountRouter = require('./account.router.js');
var locationRouter = require('./location.router.js');
var requestRouter = require('./request.router.js');
var responseRouter = require('./response.router.js');

module.exports = function(app){
	app.use('/api', accountRouter);
	app.use('/api', requestRouter);
	app.use('/api', responseRouter);
};