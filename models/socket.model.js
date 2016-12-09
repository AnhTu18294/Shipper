'use strict'

// 1: connected
// 2: disconnected

var SocketModel = function(_db) {
    this.db = _db;
};

SocketModel.prototype.getConnectedSocketIdByUserId = function(_userId, _role, callback) {
    var values = [_userId, _role];

    var queryString = 'SELECT socket_id FROM socket WHERE user_id = $1 AND role = $2 AND status = 1';

    var socketExisted = function(data) {
        return callback(false, 'user is connected!', data);
    };

    var socketNotExist = function(err) {
        return callback(true, 'user is disconnected!', err);
    };
    this.db.one(queryString, values)
        .then(socketExisted).catch(socketNotExist);
};

SocketModel.prototype.insertConnectedSocket = function(_userId, _role, _socketId, callback) {
    var self = this;
    var values1 = [_userId];
    var values2 = [_userId, _role, _socketId, 1];
    var queryString1 = 'DELETE FROM socket WHERE user_id = $1';
    var queryString2 = 'INSERT INTO socket(user_id, role, socket_id, status) VALUES($1, $2, $3, $4) RETURNING *';

    var deleteSuccess = function() {
        var insertSuccess = function(data) {
            return callback(false, 'delete success and insert success!', data);
        };

        var insertFailed = function(err) {
            console.log(err);
            return callback(true, 'delete success but insert failed', null);
        };
        self.db.one(queryString2, values2)
            .then(insertSuccess).catch(insertFailed);
    };

    var deleteFailed = function(err) {
        console.log(err);
        return callback(true, 'delete failed', null);
    };

    this.db.none(queryString1, values1)
        .then(deleteSuccess)
        .catch(deleteFailed);


};

SocketModel.prototype.changeToDisconnectedStatus = function(_socketId, callback) {
    var values = [_socketId];

    var queryString = 'UPDATE socket SET status = 2 WHERE socket_id = $1 RETURNING *';

    var updateSuccess = function(data) {
        return callback(false, 'update success', data);
    };

    var updateFailed = function(err) {
        console.log(err);
        return callback(true, 'update failed', null);
    };

    this.db.one(queryString, values)
        .then(updateSuccess)
        .catch(updateFailed);
};

SocketModel.prototype.deleteDisconnectedSocket = function(_socketId, callback) {
    var values = [_socketId];
    var queryString = 'DELETE FROM socket WHERE socket_id = $1';
    var deleteSuccess = function() {
        return callback(false, 'delete success', null);
    };

    var deleteFailed = function(err) {
        console.log(err);
        return callback(true, 'delete failed', null);
    };
    this.db.none(queryString, values)
        .then(deleteSuccess)
        .catch(deleteFailed);
}

module.exports = SocketModel;