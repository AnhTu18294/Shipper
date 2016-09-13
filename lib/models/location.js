var Location = function() {};

Location.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Location.prototype.getId = function(){
	return this.id;
};

Location.prototype.setCountry = function(_country){
	this.country = _country;
	return this;
};

Location.prototype.getCountry = function(){
	return this.country;
};

Location.prototype.setProvince = function(_province){
	this.province = _province;
	return this;
};

Location.prototype.getProvince = function(){
	return this.province;
};

Location.prototype.setCity = function(_city){
	this.city = _city;
	return this;
};

Location.prototype.getCity = function(){
	return this.city;
};

Location.prototype.setDistrict = function(_district){
	this.district = _district;
	return this;
};

Location.prototype.getDistrict = function(){
	return this.district;
};

Location.prototype.setStreet = function(_street){
	this.street = _street;
	return this.street;
};

Location.prototype.getStreet = function(){
	return this.street;
};

Location.prototype.setX = function(_x){
	this.x = _x;
	return this;
};

Location.prototype.getX = function(){
	return this.x;
};

Location.prototype.setY = function(_y){
	this.y = _y;
	return this;
};

Location.prototype.getY = function(){
	return this.y;
};

module.exports = Location;