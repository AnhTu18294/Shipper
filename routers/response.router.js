'use strict'
var express = require('express');
var router = express.Router();
var responseController = require('../controllers/response.controller.js');

router.post('/responses', responseController.createResponse);
router.get('/responses/request/:requestId', responseController.getResponsesByRequestId);
router.get('/responses/shipper/:shipperId', responseController.getResponsesByShipperId);
router.post('/responses/accept', responseController.acceptResponse);
router.post('/responses/cancel', responseController.cancelResponse);


module.exports = router;