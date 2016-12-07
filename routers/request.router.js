'use strict'
var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request.controller.js');

router.post('/requests', requestController.createRequest);
router.get('/requests/store/:storeId', requestController.getRequestByIdStore);
router.get('/requests/store/:storeId/:status', requestController.getRequestByIdStoreAndStatus);
router.put('/requests/:requestId', requestController.updateStatus);

module.exports = router;