var imageTool = require('../../../lib/utils/image.js');
var fs = require('fs');

var base64Str = fs.readFileSync('decodedImage.txt', 'utf8');

// imageTool.createImageFromBase64String('../../../images/', base64Str,'png', function(err, message, data){
// 	console.log(err + '||' + message + '||' + data);
// });
imageTool.createImageFromBase64StringSync('../../../images/', base64Str,'png');