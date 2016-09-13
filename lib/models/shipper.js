var Shipper = function(){};

Shipper.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Shipper.prototype.getId = function(){
	return this.id;
};

Shipper.prototype.setName = function(_name){
	this.name = _name;
	return this;
};

Shipper.prototype.getName = function(){
	return this.name;
};

Shipper.prototype.setPhoneNumber = function(_phoneNumber){
	this.phoneNumber = _phoneNumber;
	return this;
};

Shipper.prototype.getPhoneNumber = function(){
	return this.phoneNumber;
};

Shipper.prototype.setAddress = function(_address){
	this.address = _address;
	return this;
};

Shipper.prototype.getAddress = function(){
	return this.address;
};

Shipper.prototype.setAvatar = function(_avatar){
	this.avatar = _avatar;
	return this;
};

Shipper.prototype.getAvatar = function(){
	return this.avatar;
};

Shipper.prototype.setBirthday = function(_birthday){
	this.birthday = _birthday;
	return this;
};

Shipper.prototype.getBirthday = function(){
	return this.birthday;
};

Shipper.prototype.setX = function(_x){
	this.x = _x;
	return this;
};

Shipper.prototype.getX = function(){
	return this.x;
};

Shipper.prototype.setY = function(_y){
	this.y = _y;
	return this;
};

Shipper.prototype.getY = function(){
	return this.y;
};

Shipper.prototype.setAccountId = function(_accountId){
	this.accountId =  _accountId;
	return this;
};

Shipper.prototype.getAccountId = function(){
	return this.accountId;
};

Shipper.prototype.setRank = function(_rank){
	this.rank = _rank;
	return this;
};

Shipper.prototype.getRank = function(){
	return this.rank;
};

module.exports = Shipper;