'use strict'
var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request.controller.js');

// create new request
router.post('/requests/create', requestController.createRequest);

// get request by store
router.get('/requests/store/:storeId', requestController.getRequestByIdStore);
router.get('/requests/store/:storeId/:status', requestController.getRequestByIdStoreAndStatus);

// get full information of a request
router.get('/requests/request/:requestId/:shipperId', requestController.getRequestByRequestId);

// update request status
router.put('/requests/confirm/:requestId', requestController.requireConfirmRequest);
router.put('/requests/confirmed/:requestId', requestController.confirmCompletedRequest);


// load 4 tabs for shipper's home
router.get('/requests/new/:shipperId', requestController.getLastestRequests);
router.get('/requests/waiting/:shipperId', requestController.getWaitingRequests);
router.get('/requests/processing/:shipperId', requestController.getProcessingRequests);
router.get('/requests/completed/:shipperId', requestController.getCompletedRequests);

module.exports = router;