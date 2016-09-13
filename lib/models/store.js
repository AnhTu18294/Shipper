var Store = function(){};

Store.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Store.prototype.getId = function(){
	return this.id;
};

Store.prototype.setName = function(_name){
	this.name = _name;
	return this;
};

Store.prototype.getName = function(){
	return this.name;
};

Store.prototype.setPhoneNumber = function(_phoneNumber){
	this.phoneNumber = _phoneNumber;
	return this;
};

Store.prototype.getPhoneNumber = function(){
	return this.phoneNumber;
};

Store.prototype.setAddress = function(_address){
	this.address = _address;
	return this;
};

Store.prototype.getAddress = function(){
	return this.address;
};

Store.prototype.setLocationId = function(_locationId){
	this.locationId = _locationId;
	return this;
};

Store.prototype.getLocationId = function(){
	return this.locationId;
};

Store.prototype.setAccountId = function(_accountId){
	this.accountId =  _accountId;
	return this;
};

Store.prototype.getAccountId = function(){
	return this.accountId;
};

module.exports = Store;