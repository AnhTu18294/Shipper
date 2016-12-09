'use strict'
var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request.controller.js');

router.post('/requests', requestController.createRequest);
router.get('/requests/store/:storeId', requestController.getRequestByIdStore);
router.get('/requests/store/:storeId/:status', requestController.getRequestByIdStoreAndStatus);

// update request status
router.get('/requests/confirm/:requestId', requestController.requireConfirmRequest);
router.get('/requests/confirmed/:requestId', requestController.confirmCompletedRequest);


// load 4 tabs for shipper's home
router.get('/requests/new/:shipperId', requestController.getLastestRequests);
router.get('/requests/waiting/:shipperId', requestController.getWaitingRequests);
router.get('/requests/processing/:shipperId', requestController.getProcessingRequests);
router.get('/requests/completed/:shipperId', requestController.getCompletedRequests);

module.exports = router;