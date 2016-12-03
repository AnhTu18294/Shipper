module.exports.postgresql = {
	'host': 'localhost',
	'port': '5432',
	'database': 'Shipper_v1',
	'user': 'postgres'
};

module.exports.mongodb = {
	host: 'localhost',
	port: '',
	dbname: ''
};

module.exports.sender = {
	gmail: 'nguyenhuyhoangpfiev@gmail.com',
	password: 'huyhoang'
};

module.exports.smtpConfig = {
	host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'nguyenhuyhoangpfiev@gmail.com',
        pass: 'huyhoang'
    }
};

module.exports.imageFolder = '/home/anhtu/myproject/Shipper/images/';