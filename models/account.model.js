'use strict'
var hashTool = require('../lib/utils/hash.js');
var imageTool = require('../lib/utils/image.js');
var AccountObserver = require('../observers/accountObserver.js');
var nodeUuid = require('node-uuid');
var pathToImageFolder = require('../configs/config.js').imageFolder;

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
    var self = this;
    var salt = hashTool.generateSaltRandom();
    var hash = hashTool.hashPasswordWithSalt(_account.password, salt);
    var activeCode = hashTool.generateSaltRandom(8);
    var resetCode = hashTool.generateSaltRandom(8);

    _account.password = hash;
    _account.salt = salt;
    _account.activeCode = activeCode;
    _account.resetCode = resetCode;

    var queryString = "INSERT INTO Shipper(email, password, salt, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, created_time, updated_time, active_code, status, reset_code) "
            + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) "
            + "RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, status, active_code";
    
    var createSuccessfulThenReturnAccountId = function(data) {
        AccountObserver.emit('create-shipper-account',data);
        delete data.active_code;
        return callback(false, 'Register Shipper success!', data);
    };

    var createUnsuccesfulThenReturnErrorMessage = function(err) {
        return callback(true, 'Register Shipper Error!', err);
    };
    if((_account.imageExtension != undefined) && (_account.imageBase64String != undefined)){
        var filename = nodeUuid.v4() + '.' + _account.imageExtension;        
        var path = pathToImageFolder + filename;
        imageTool.createImageFromBase64String(path, _account.imageBase64String, function(err, message, result){
            if(err){
                return callback(true, 'Cannot create Image for avatar', result);
            }else{
                _account.avatar = filename;
                var values = [_account.email, _account.password, _account.salt, _account.name, _account.phoneNumber, _account.address, _account.avatar, _account.birthday, _account.longitude, _account.latitude, _account.rating, _account.vote, _account.createdTime, _account.updatedTime, _account.activeCode, _account.status, _account.resetCode];
                self.db.one(queryString, values)
                    .then(createSuccessfulThenReturnAccountId)
                    .catch(createUnsuccesfulThenReturnErrorMessage);
            }
        })
    }else{
        var values = [_account.email, _account.password, _account.salt, _account.name, _account.phoneNumber, _account.address, _account.avatar, _account.birthday, _account.longitude, _account.latitude, _account.rating, _account.vote, _account.createdTime, _account.updatedTime, _account.activeCode, _account.status, _account.resetCode];
        this.db.one(queryString, values)
            .then(createSuccessfulThenReturnAccountId)
            .catch(createUnsuccesfulThenReturnErrorMessage);
    }                    
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
                + 'RETURNING id, email, name, phone_number, store_type, location_id, address, rating, vote, avatar, status, active_code';
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
        delete data.active_code;
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
                    return callback(false, 'Email and Password are valid! Login Success!', data);
                }
            }
        }
    });
}

// ***********************************************************************************
AccountModel.prototype.findByEmail = function(_email, _role, callback) {
    var values = [_email];
    
    var accountFound = function(data) {
 
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
        var queryString = 'SELECT store.*, location.city, location.longitude, location.latitude, location.country, location.district, location.street FROM store, location WHERE store.email = $1 AND store.location_id = location.id';
        this.db.one(queryString, values)
        .then(accountFound)
        .catch(accountNotFound);
    }else{
        return callback(true, 'Role Error!', false);
    }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACTIVE ACCOUNT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
AccountModel.prototype.activeAccount = function(_role, _idAccount, _activeCode, callback){
    var self = this;
    var queryString = undefined;
    var values = [_idAccount, _activeCode];
    
    if(_role == 1){
        queryString = 'SELECT id FROM shipper WHERE id = $1 AND active_code = $2';   
    }else if(_role == 2){
        queryString = 'SELECT id FROM store WHERE id = $1 AND active_code = $2';  
    }else{
        return callback(true, "ERROR: Role is wrong (select 1 or 2)!", null);
    }

    var activeCodeValid = function(data){
        if(_role == 1){
            queryString = 'UPDATE shipper SET status = $1 WHERE id = $2 '
                        + 'RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote';
        }
        if(_role == 2){
            queryString = 'UPDATE store SET status = $1 WHERE id = $2 '
                        + 'RETURNING id, email, name, phone_number, store_type, location_id, address, rating, vote';
        }
        values = [1, _idAccount];

        var changeStatusError = function(err){
            console.log(err);
            return callback(true, 'Active code is RIGHT but there was some errors when trying to change account status', null);
        };

        var changeStatusSuccessful = function(data){
            AccountObserver.emit('active-account', {idAccount: _idAccount});
            return callback(false, 'Account is actived', data);
        };

        self.db.one(queryString, values)
            .then(changeStatusSuccessful)
            .catch(changeStatusError);
        
    };

    var activeCodeNotValid = function(err){
        console.log(err);
        return callback(true, 'Active Code is WRONG. Account is NOT actived', null);
    }

    this.db.one(queryString, values)
        .then(activeCodeValid)
        .catch(activeCodeNotValid)
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RESET PASSWORD <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

AccountModel.prototype.requireResetPassword = function(_role, _email, callback){
    var self = this;
    var queryString = undefined;
    var values = [_email];
    if(_role == 1){
        queryString = 'SELECT id FROM shipper WHERE email = $1';   
    }else if(_role == 2){
        queryString = 'SELECT id FROM store WHERE email = $1';  
    }else{
        return callback(true, "ERROR: Role is wrong (select 1 or 2)!", null);
    }

    var emailExsitedThenResetCode = function(data){
        var resetCode = hashTool.generateSaltRandom(8);
        console.log(resetCode);
        if(_role == 1){
            queryString = 'UPDATE shipper SET reset_code = $1 WHERE id = $2 '
                        + 'RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, status, reset_code';
        }
        if(_role == 2){
            queryString = 'UPDATE store SET reset_code = $1 WHERE id = $2 '
                        + 'RETURNING id, email, name, phone_number, store_type, location_id, address, rating, vote, avatar, status, reset_code';
        }

        var setResetCodeSuccessful = function(data){
            AccountObserver.emit('require-reset-code', data);
            delete data.reset_code;
            return callback(false, 'Recreated reset code successful', null);
        }

        var setResetCodeFailed = function(err){
            return callback(false, 'Email is CORRECT but cannot create reset code, please try again', err);
        }
        values = [resetCode, data.id];
        self.db.one(queryString, values)
            .then(setResetCodeSuccessful)
            .catch(setResetCodeFailed)
    };

    var emailNotExisted = function(err){
        console.log(err);
        return callback(true, 'Email is WRONG. CANNOT reset password', err);
    };

    this.db.one(queryString, values)
        .then(emailExsitedThenResetCode)
        .catch(emailNotExisted);
};

AccountModel.prototype.checkResetCodeAndUpdatePassword = function(_role, _email, _resetCode, _password, callback){
    var self = this;
    var queryString1 = undefined;
    var queryString2 = undefined;
    var values = [_email, _resetCode];

    if(_role == 1){
        queryString1 = 'SELECT id FROM shipper WHERE email = $1 AND reset_code = $2';  
        queryString2 = 'UPDATE shipper SET password = $1, salt = $2 WHERE id = $3 '
                    + 'RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote, status'; 
    }else if(_role == 2){
        queryString1 = 'SELECT id FROM store WHERE email = $1 AND reset_code = $2';
        queryString2 = 'UPDATE store SET password = $1, salt = $2 WHERE id = $3 '
                    + 'RETURNING id, email, name, phone_number, store_type, location_id, address, rating, vote, avatar, status'; 
    }else{
        return callback(true, "ERROR: Role is wrong (select 1 or 2)!", null);
    }

    var resetCodeValid = function(data){
        // UPDATE PASSWORD
        var idAccount = data.id;
        var salt = hashTool.generateSaltRandom();
        var password = hashTool.hashPasswordWithSalt(_password, salt);

        var values = [password, salt, idAccount];

        var updateSuccessfulThenReturnAccountUpdated = function(data) {
            return callback(false,'Reset Code is CORRECT and Update Password Successful', data);
        };

        var updateUnsuccesfulThenReturnErrorMessage = function(err) {
            return callback(true,'Reset Code is CORRECT but CANNOT update Password, please try again', err);
        };

        self.db.one(queryString2, values)
            .then(updateSuccessfulThenReturnAccountUpdated)
            .catch(updateUnsuccesfulThenReturnErrorMessage);
    };

    var resetCodeNotValid = function(err){
        return callback(true, 'Reset Code is WRONG. ', null);

    };

    this.db.one(queryString1, values)
        .then(resetCodeValid)
        .catch(resetCodeNotValid)
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

AccountModel.prototype.getShipper = function(_shipperId, callback) {

    var queryString = 'SELECT shipper.* FROM shipper WHERE id = $1 ';
    var values = [_shipperId];

    var getShipperSuccessful = function(data) {
        delete data.password;
        delete data.salt;
        delete data.reset_code;
        delete data.active_code;
        delete data.created_time;
        delete data.updated_time;
        return callback(false, data);
    };

    var getShipperError = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(getShipperSuccessful)
        .catch(getShipperError);
};

AccountModel.prototype.getStore = function(_storeId, callback) {
    var queryString = 'SELECT store.*,location.id AS location_id, location.street, location.city, location.district, location.country, location.longitude, location.latitude FROM store, location WHERE store.id = $1 AND location.id = store.location_id' ;
    var values = [_storeId];

    var getStoreSuccessful = function(data) {
        delete data.password;
        delete data.salt;
        delete data.reset_code;
        delete data.active_code;
        delete data.created_time;
        delete data.updated_time;
        return callback(false, data);
    };

    var getStoreError = function(err) {
        return callback(true, err);
    };

    this.db.one(queryString, values)
        .then(getStoreSuccessful)
        .catch(getStoreError);
};

AccountModel.prototype.updateProfile = function(_input,callback) {
    var updateProfileSuccessful = function(data) {
        return callback(false, 'Update profile successful!' , data);
    };
    var updateProfileError = function(err) {
        return callback(true, 'ERROR, CANNOT update profile!', err);
    };

    var role = _input.role;
    var id = _input.idAccount;

    if(role == 1){
        var values = [_input.name, _input.phoneNumber, _input.address, _input.birthday, id ];
        var queryString = 'UPDATE shipper SET name = $1, phone_number = $2, address = $3, birthday = $4  WHERE id = $5 '
                        + 'RETURNING id, email, name, phone_number, address, avatar, birthday, longitude, latitude, rating, vote';

        this.db.one(queryString, values)
        .then(updateProfileSuccessful)
        .catch(updateProfileError);

    }else if(role == 2){
        this.db.tx(function (t) {
            var values_1 = [_input.name, _input.phoneNumber, _input.storeType, _input.address, id];
            var values_2 = [_input.city, _input.district, _input.street, _input.country, id];
            var q1 = this.one('UPDATE store SET name = $1, phone_number = $2, store_type = $3, address = $4 WHERE id = $5 '
                        + 'RETURNING id, email, name, phone_number, store_type, location_id, address, rating, vote', values_1);
            var q2 = this.one('UPDATE location SET city = $1, district = $2, street = $3, country = $4 '
                + 'WHERE id = (SELECT location_id FROM store WHERE store.id = $5) RETURNING city, district, street, country', values_2);
          
            return this.batch([q1, q2]); 
        })
        .then(updateProfileSuccessful)
        .catch(updateProfileError);
                        
    }else{
        return callback(true, 'Role ERROR', null);
    }     
}

module.exports = AccountModel;
