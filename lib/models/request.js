var Request = function(){};

Request.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Request.prototype.getId = function(){
	return this.id;
};

Request.prototype.setDeposit = function(_deposit){
	this.deposit = _deposit;
	return this;
};

Request.prototype.getDeposit = function(){
	return this.deposit;
};

Request.prototype.setDistance = function(_distance){
	this.distance = _distance;
	return this;
};

Request.prototype.getDistance = function(){
	return this.distance;
};

Request.prototype.setStartTime = function(_startTime){
	this.startTime = _startTime;
	return this;
};

Request.prototype.getStartTime = function(){
	return this.startTime;
};

Request.prototype.setEndTime = function(_endTime){
	this.endTime = _endTime;
	return this;
};

Request.prototype.getEndTime = function(){
	return this.endTime;
};

Request.prototype.setStoreId = function(_storeId){
	this.storeId = _storeId;
	return this;
};

Request.prototype.getStoreId = function(){
	return this.storeId;
};

Request.prototype.setDestination = function(_destination){
	this.destination = _destination;
	return this;
};

Request.prototype.getDestination = function(){
	return this.destination;
};

Request.prototype.setPrice = function(_price){
	this.price = _price;
	return this;
};

Request.prototype.getPrice = function(){
	return this.price;
};

Request.prototype.setProductId = function(_productId){
	this.productId = _productId;
	return this;
};

Request.prototype.getProductId = function(){
	return this.productId;
};

Request.prototype.setPhoneNumber = function(_phoneNumber){
	this.phoneNumber = _phoneNumber;
	return this;
};

Request.prototype.getPhoneNumber = function(){
	return this.phoneNumber;
};

Request.prototype.setStatus = function(_status){
	this.status = _status;
	return this;
};

Request.prototype.getStatus = function(){
	return this.status;
};