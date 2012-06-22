var SECRET_KEY = 'BgIPIUgDT1wOwyKQN9Mp';

var crypto = require('crypto');

exports.create = function(timestamp){
	return crypto.createHash('md5').update(SECRET_KEY + timestamp).digest('hex');
}

exports.isValid = function(securityHash, timestamp){
	return exports.create(timestamp) == securityHash;
}
