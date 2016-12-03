var express = require('express');
var router = express.Router();
var accountController = require('../controllers/account.controller.js');

// router.get('/accounts/:account_id', accountController.getAnAccountById);
// router.post('/accounts', accountController.insertAnAccount);
// router.get('/accounts/:email/:pass')

// register
router.post('/accounts/register', accountController.checkAccountExisted, accountController.createAccount);
router.post('/accounts/login', accountController.loginAccount);
router.post('/accounts/active', accountController.activeAccount);
router.post('/accounts/requireResetPassword', accountController.requireResetPassword);
router.post('/accounts/checkResetCode', accountController.checkResetCode);
router.post('/accounts/updatePassword', accountController.updatePassword);
module.exports = router;