'use strict'
var hashTool = require('../lib/utils/hash.js');
var AccountObserver = require('../observers/accountObserver.js');
var AccountModel = function(_db) {
    this.db = _db;
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REGISTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
AccountModel.prototype.checkAccountExisted = function(_email, _role, callback) {
    if(_role == 1){
        var queryString = 'SELECT * FROM shipper WHERE email = $1';
    }else if(_role == 2){
        var queryString = 'SELECT * FROM store WHERE email = $1';
    }else{
        return callback(false, 'Role Error!', null);
    }

    var values = [_email];

    var NOT_EXIST = true;
    var EXIST = false;
    var accountExisted = function(data) {
        return callback(false, 'Email is existed!', EXIST);
    };

    var accountNotExist = function(err) {
        return callback(true, 'Email can be use!', NOT_EXIST);
    };        
    this.db.one(queryString, values)
            .then(accountExisted).catch(accountNotExist);
}; 

AccountModel.prototype.createShipperAccount = function(_account, callback) {
    var salt = hashTool.generateSaltRandom();
    var hash = hashTool.hashPasswordWithSalt(_account.password, salt);
    var activeCode = hashTool.generateSaltRandom(8);
    var resetCode = hashTool.generateSaltRandom(8);

    _account.password = hash;
    _account.salt = salt;
    _account.activeCode = activeCode;
    _account.resetCode = resetCode;

    var queryString = 'INSERT INTO Shipper(email, password, salt, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, created_time, updated_time, active_code, status, reset_code) '
            + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) '
            + 'RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, status';
    var values = [_account.email, _account.password, _account.salt, _account.name, _account.phoneNumber, _account.address, _account.avatar, _account.birthday, _account.longitude, _account.latitude, _account.rating, _account.vote, _account.createdTime, _account.updatedTime, _account.activeCode, _account.status, _account.resetCode];

    var createSuccessfulThenReturnAccountId = function(data) {
        AccountObserver.emit('create-shipper-account',data);
        return callback(false, 'Register Shipper success!', data);
    };

    var createUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, 'Register Shipper Error!', err);
    };

    this.db.one(queryString, values)
        .then(createSuccessfulThenReturnAccountId)
        .catch(createUnsuccesfulThenReturnErrorMessage);
}

AccountModel.prototype.createStoreAccount = function(_account, _location, callback) {
    var salt = hashTool.generateSaltRandom();
    var hash = hashTool.hashPasswordWithSalt(_account.password, salt);
    var activeCode = hashTool.generateSaltRandom(8);
    var resetCode = hashTool.generateSaltRandom(8);

    _account.password = hash;
    _account.salt = salt;
    _account.activeCode = activeCode;
    _account.resetCode = resetCode;

    var query = 'WITH new_location AS ('
                + 'INSERT INTO location (country, city, district, street, longitude, latitude) '
                + 'VALUES ($1, $2, $3, $4, $5, $6) '
                + 'RETURNING id ) '
                + 'INSERT INTO store (email, password, salt, name, phone_number, store_type, location_id, address, rating, vote, created_time, updated_time, avatar, status, reset_code, active_code) '
                + 'VALUES ($7, $8, $9, $10, $11, $12, (SELECT id FROM new_location), $13, $14, $15, $16, $17, $18, $19, $20, $21) '
                + 'RETURNING email, name, phone_number, store_type, location_id, address, rating, vote, avatar, status';
    var values  = [_location.country, _location.city, _location.district, _location.street, _location.longitude, 
                   _location.latitude, _account.email, _account.password, _account.salt, _account.name, _account.phoneNumber, 
                   _account.storeType, _account.address, _account.rating, _account.vote, _account.createdTime, 
                   _account.updatedTime, _account.avatar, _account.status, _account.resetCode, _account.activeCode];
    
    var createSuccessfulThenReturnAccountId = function(data) {
        data.country = _location.country;
        data.city = _location.city;
        data.district = _location.district;
        data.street = _location.street;
        data.longitude = _location.longitude;
        data.latitude = _location.latitude;
        
        AccountObserver.emit('create-store-account',data);
        return callback(false, 'Register Store Account Success!', data);
    };

    var createUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, 'Register Store Account Error!', err);
    };

    this.db.one(query, values)
        .then(createSuccessfulThenReturnAccountId)
        .catch(createUnsuccesfulThenReturnErrorMessage);
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LOGIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
AccountModel.prototype.loginAccount = function(_loginInput, callback) {
    var role = _loginInput.role;
    var email = _loginInput.email;
    var password = _loginInput.password;

    this.findByEmail(email, role, function(err, message, data) {
        if (err){
            return callback(true, 'Incorrect Email!',err);
        }else{
            var hash = hashTool.hashPasswordWithSalt(password, data.salt);
            if (hash != data.password) {
                return callback(true, 'Incorrect Password! Login Fail!', null);
            }else{
                if(data.status == 0){
                    return callback(false, 'Email and Password are valid! Account Not Active!', data);
                }else {
                    return callback(true, 'Email and Password are valid! Login Success!', data);
                }
            }
        }
    });
}


AccountModel.prototype.findByEmail = function(_email, _role, callback) {
    var values = [_email];
    
    var accountFound = function(data) {
        console.log(data);
        return callback(false, 'Founded Account!' ,data);
    };
    var accountNotFound = function(err) {
        return callback(true, 'Not Found Account!', err);
    };

    if(_role == 1){
        var queryString = 'SELECT * FROM shipper WHERE email = $1';
        this.db.one(queryString, values)
        .then(accountFound)
        .catch(accountNotFound);
    }else if(_role == 2){
        var queryString = 'SELECT * FROM store WHERE email = $1';
        this.db.one(queryString, values)
        .then(accountFound)
        .catch(accountNotFound);
    }else{
        return callback(true, 'Role Error!', false);
    }
};




//
AccountModel.prototype.deleteAnAccount = function(_id, callback) {
    var queryString = 'DELETE FROM accounts where id = $1 returning *';
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
    var queryString = 'UPDATE accounts SET user_name = $1 WHERE id = $2 returning *';
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
    var queryString = 'UPDATE accounts SET hash = $1, salt = $2 WHERE id = $3 returning *';
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

AccountModel.prototype.findById = function(_id, callback) {
    var queryString = 'SELECT * FROM accounts WHERE id = $1';
    var values = [_id];

    var accountFound = function(data) {
        return callback(false, data);
    };
    var accountNotFound = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(accountFound)
        .catch(accountNotFound);
};

module.exports = AccountModel;
