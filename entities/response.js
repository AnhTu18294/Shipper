'use strict'

var Response = function(){
	this.id = undefined;
	this.requestId = undefined;
	this.shipperId = undefined;
	this.status = undefined;
	this.createdTime = undefined;
	this.updatedTime = undefined;
};

module.exports = Response;

/*
status: 
0: Shipper tao response cho 1 request, dang cho phan hoi: waiting
1: Shipper bi huy hoac yeu cau huy reponse: canceled
2: Shipper nhan dc accept tu store : accepted
*/