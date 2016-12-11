'use strict'
var express = require('express');
var router = express.Router();
var responseController = require('../controllers/response.controller.js');


// create new response for request 
router.post('/responses/create', responseController.createResponse);


router.get('/responses/request/:requestId', responseController.getResponsesByRequestId);
router.get('/responses/shipper/:shipperId', responseController.getResponsesByShipperId);
router.post('/responses/accept', responseController.acceptResponse);
router.post('/responses/getListShipperToNotify', responseController.getListShipperToNotify);
router.post('/responses/cancel', responseController.cancelResponse);


module.exports = router;