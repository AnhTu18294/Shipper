'use strict'


var fs = require('fs');


module.exports.createImageFromBase64StringSync = function(path, base64Str){
	var bitmap = new Buffer(base64Str, 'base64');
	fs.writeFileSync(path, bitmap);
};

module.exports.createImageFromBase64String = function(path, base64Str, callback){
	var bitmap = new Buffer(base64Str, 'base64');
	fs.writeFile(path, bitmap, function(err, written){
		if(err){
			return callback(true, 'ERROR: Cannot write file', err);
		}
		return callback(false, 'create Image successful', written);
	});
}
