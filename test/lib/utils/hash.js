var hashTool = require('../../../lib/utils/hash.js');
var salt = hashTool.generateSaltRandom()
console.log(salt);
console.log(hashTool.generateSaltRandom(20));

console.log(hashTool.hashPasswordWithSalt('MYPASSWORD',salt));

