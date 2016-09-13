var Account = function(){};

Account.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Account.prototype.getId = function(){
	return this.id;
};

Account.prototype.setEmail = function(_email){
	this.email = _email;
	return this;
};

Account.prototype.getEmail = function(){
	return this.email;
};

Account.prototype.setUserName = function(_userName){
	this.userName = _userName;
	return this;
};

Account.prototype.getUserName = function(){
	return this.userName;
}

Account.prototype.setPassword = function(_password){
	this.password = _password;
	return this;
};

Account.prototype.getPassword = function(){
	return this.password;
};

Account.prototype.setHash = function(_hash){
	this.hash = _hash;
	return this;
};

Account.prototype.getHash = function(){
	return this.hash;
};

Account.prototype.setSalt = function(_salt){
	this.salt = _salt;
	return this;
};

Account.prototype.getSalt = function(){
	return this.salt;
};

Account.prototype.setRole = function(_role){
	this.role = _role;
	return this;
};

Account.prototype.getRole = function(){
	return this.role;
};

module.exports = Account;