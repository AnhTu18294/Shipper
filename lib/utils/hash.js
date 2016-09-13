'use-strict'
var crypto = require('crypto');

var lengthSalt = 16;

module.exports.generateSaltRandom = function(_lengthSalt) {
    if(_lengthSalt == null){_lengthSalt = lengthSalt};
    var salt = crypto.randomBytes(Math.ceil(_lengthSalt / 2))
        .toString('hex')
        .slice(0, _lengthSalt);
    return salt;
};

module.exports.hashPasswordWithSalt = function(password, _salt) {
    var hmac = crypto.createHmac('sha512', _salt);
    hmac.update(password);
    var hashPassword = hmac.digest('hex');

    return hashPassword;
};
