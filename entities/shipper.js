'use strict'
/**
	ACTIVE = 1
	NOT_ACTIVE = 0
 */
var ACTIVE = 1;
var NOT_ACTIVE = 0;
var RATING_DEFAULT = 0;
var VOTE_DEFAULT = 0;
var AVATAR_DEFAULT = 'userdefault.jpg';

var Shipper = function() {
	this.id = undefined;
	this.email = undefined;
	this.password = undefined;
	this.salt = undefined;
	this.name = undefined;
	this.phoneNumber = undefined;
	this.address = undefined;
	this.avatar = AVATAR_DEFAULT;
	this.birthday = undefined;
	this.longitude = undefined;
	this.latitude = undefined;
	this.rating = RATING_DEFAULT;
	this.vote = VOTE_DEFAULT;
	this.createdTime = undefined;
	this.updatedTime = undefined;
	this.reset_code = undefined;
	this.status = NOT_ACTIVE;
	this.active_code = undefined;
};

module.exports = Shipper;