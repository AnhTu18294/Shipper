var createEmailContent = function(data){
	var content = ''+
	'Dear ' + data.name +'</br>'
   +'<p>Welcome to <strong><i>Shipper Community!</i></strong>! </br>'
   +'To complete the register process, please use this code to active your account \n'
   +'Here your code: <strong>' + data.active_code + '</strong></p>'
   +'<p><strong>Thank you for your interest!</strong></p>';
	return content;
}
module.exports.createEmailContent = createEmailContent;
