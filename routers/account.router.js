var express = require('express');
var router = express.Router();
var accountController = require('../controllers/account.controller.js');

// register
router.post('/accounts/register', accountController.checkAccountExisted, accountController.createAccount);
router.post('/accounts/login', accountController.loginAccount);
router.post('/accounts/active', accountController.activeAccount);
router.post('/accounts/requireResetPassword', accountController.requireResetPassword);
router.post('/accounts/checkResetCodeAndUpdatePassword', accountController.checkResetCodeAndUpdatePassword);
// router.post('/accounts/updatePassword', accountController.updatePassword);

router.get('/accounts/shipper/:shipperId', accountController.getShipper);
router.get('/accounts/store/:storeId', accountController.getStore);

module.exports = router;