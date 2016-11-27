var express = require('express');
var router = express.Router();
var accountController = require('../controllers/account.controller.js');

// router.get('/accounts/:account_id', accountController.getAnAccountById);
// router.post('/accounts', accountController.insertAnAccount);
// router.get('/accounts/:email/:pass')

// register
router.post('/accounts/register', accountController.checkAccountExisted, accountController.createAccount);

module.exports = router;