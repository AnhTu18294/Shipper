'use strict'
var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request.controller.js');

// create new request
router.post('/requests/create', requestController.createRequest);

// get request by store
//router.get('/requests/store/:storeId', requestController.getRequestByIdStore);
//router.get('/requests/store/:storeId/:status', requestController.getRequestByIdStoreAndStatus);
// CANCEL REQUEST BY STORE
router.put('/requests/cancel/:requestId', requestController.cancelRequestByStore);

// get full information of a request
router.get('/requests/request/:requestId/:shipperId', requestController.getRequestByRequestId);

// update request status
router.put('/requests/confirm/:requestId', requestController.requireConfirmRequest);
router.put('/requests/confirmed/:requestId', requestController.confirmCompletedRequest);


// load 4 tabs for shipper's home
router.get('/requests/shipper/new/:shipperId', requestController.getLastestRequestsByShipper);
router.get('/requests/shipper/waiting/:shipperId', requestController.getWaitingRequestsByShipper);
router.get('/requests/shipper/processing/:shipperId', requestController.getProcessingRequestsByShipper);
router.get('/requests/shipper/completed/:shipperId', requestController.getCompletedRequestsByShipper);

// load 3 tabs for store's home
router.get('/requests/store/waiting/:storeId', requestController.getWaitingRequestsByStore);
router.get('/requests/store/processing/:storeId', requestController.getProcessingRequestsByStore);
router.get('/requests/store/completed/:storeId', requestController.getCompletedRequestsByStore);

// load specific item in tab for store 

router.get('/requests/store/specific-item/:requestId', requestController.getRequestAndListShipper);
module.exports = router;