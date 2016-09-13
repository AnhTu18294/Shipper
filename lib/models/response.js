var Response = function(){};

Response.prototype.setId = function(_id){
	this.id = _id;
	return this;
};

Response.prototype.getId = function(){
	return this.id;
};

Response.prototype.setRequestId = function(_requestId){
	this.requestId = _requestId;
	return this;
};

Response.prototype.getRequestId = function(){
	return this.requestId;
};

Response.prototype.setShipperId = function(_shipperId){
	this.shipperId = _shipperId;
	return this;
};

Response.prototype.getShipperId = function(){
	return this.shipperId;
};