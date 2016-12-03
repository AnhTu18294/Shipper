var nodemailer = require('nodemailer');

var smtpConfig = require('../../configs/config.js').smtpConfig;

var smtpTransporter = nodemailer.createTransport(smtpConfig);

module.exports = smtpTransporter;