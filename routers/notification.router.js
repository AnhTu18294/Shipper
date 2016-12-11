'use strict'
var express = require('express');
var router = express.Router();
var notificationController = require('../controllers/notification.controler.js');


router.get('/notifications/users/:user_id/:role', notificationController.getNotificationsByUserId);
router.put('/notifications/:notification_id', notificationController.updateNotificationStatus);
router.get('/notifications/users/:user_id/:role/:status', notificationController.getNotificationsByUserIdAndStatus);

module.exports = router;