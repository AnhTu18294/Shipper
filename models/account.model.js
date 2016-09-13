'use-strict'
var hashTool = require('../lib/utils/hash.js');

var AccountModel = function(_db) {
    this.db = _db;
};

AccountModel.prototype.insertAnAccount = function(_account, callback) {

    var salt = hashTool.generateSaltRandom();
    var hash = hashTool.hashPasswordWithSalt(_account.password, salt);

    _account.setHash(hash);
    _account.setSalt(salt);

    var queryString = "INSERT INTO accounts(email, user_name, hash, role, salt) values($1, $2, $3, $4, $5) returning *";
    var values = [_account.email, _account.userName, _account.hash, _account.role, _account.salt];

    var insertSuccessfulThenReturnAccountId = function(data) {
        return callback(false, data);
    };

    var insertUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(insertSuccessfulThenReturnAccountId)
        .catch(insertUnsuccesfulThenReturnErrorMessage);

};

AccountModel.prototype.deleteAnAccount = function(_id, callback) {
    var queryString = "DELETE FROM accounts where id = $1 returning *";
    var values = [_id];

    var deleteSuccessfulThenReturnAccountDeleted = function(data) {
        return callback(false, data);
    };

    var deleteUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(deleteSuccessfulThenReturnAccountDeleted)
        .catch(deleteUnsuccesfulThenReturnErrorMessage);
};

AccountModel.prototype.updateUserNameById = function(_account, callback) {
    var queryString = "UPDATE accounts SET user_name = $1 WHERE id = $2 returning *";
    var values = [_account.userName, _account.id];

    var updateSuccessfulThenReturnAccountUpdated = function(data) {
        return callback(false, data);
    };

    var updateUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(updateSuccessfulThenReturnAccountUpdated)
        .catch(updateUnsuccesfulThenReturnErrorMessage);
};

AccountModel.prototype.updatePasswordById = function(_account, callback) {

    var salt = hashTool.generateSaltRandom();
    var hash = hashTool.hashPasswordWithSalt(_account.password, salt);

    _account.setHash(hash);
    _account.setSalt(salt);
    var queryString = "UPDATE accounts SET hash = $1, salt = $2 WHERE id = $3 returning *";
    var values = [_account.hash, _account.salt, _account.id];

    var updateSuccessfulThenReturnAccountUpdated = function(data) {
        return callback(false, data);
    };

    var updateUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(updateSuccessfulThenReturnAccountUpdated)
        .catch(updateUnsuccesfulThenReturnErrorMessage);
};

AccountModel.prototype.findById = function(_id, callback){
    var queryString = "SELECT * FROM accounts WHERE id = $1";
    var values = [_id];

    var accountFound = function(data){
        return callback(false, data);
    };
    var accountNotFound = function(err){
        return callback(true, err);
    };

    this.db.one(queryString,values)
        .then(accountFound)
        .catch(accountNotFound);
};


AccountModel.prototype.findByEmail = function(_email, callback){
    var queryString = "SELECT * FROM accounts WHERE email = $1";
    var values = [_email];

    var accountFound = function(data){
        return callback(false, data);
    };
    var accountNotFound = function(err){
        return callback(true, err);
    };

    this.db.one(queryString,values)
        .then(accountFound)
        .catch(accountNotFound);
};


// AccountModel.prototype.findOne = function(options, callback){
//     var queryString = "SELECT * FROM accounts ";
//     var values = [];

//     if(!options){
//         return callback(true, null);
//     };

//     if(options.email){
//         queryString += "WHERE email = $"
//     }
// };

AccountModel.prototype.isValidUserPassword = function(email, password, callback){
    var result = true;
    this.findByEmail(email, function(err, account){
        if(err){
            result = false;
            return callback(result, {message: 'Incorrect Email!'});
        }else{
            var hash = hashTool.hashPasswordWithSalt(password, account.salt);
            if(hash != account.hash){
                result = false;
                return callback(result, {message: 'Incorrect Password!'});
            }else{
                return callback(result, {message: 'Email and Password are valid'})
            }
        }
    });
};
module.exports = AccountModel;
