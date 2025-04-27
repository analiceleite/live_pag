const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth.middleware');

// Purchase
router.post('/purchase', auth('admin'), controller.createPurchase);
router.patch('/:purchaseId/tracking', auth('admin'), controller.updateTrackingCode);

// Payments
router.get('/pendencies', auth('admin'), controller.getAllPendencies);
router.get('/pendencies-by-client/:clientId', auth('user'), controller.getPendenciesByClient);
router.patch('/mark-as-paid/:purchaseId', auth('admin'), controller.markAsPaid);
router.patch('/mark-as-unpaid/:purchaseId', auth('admin'), controller.markAsUnpaid);
router.patch('/mark-as-deleted/:purchaseId', auth('admin'), controller.markAsDeleted);
router.patch('/mark-as-undeleted/:purchaseId', auth('admin'), controller.markAsUndeleted);

// Delivery
router.patch('/delivery/request/:purchaseId', auth('user'), controller.markAsDeliveryRequested);
router.patch('/delivery/send/:purchaseId', auth('admin'), controller.markAsSent);
router.patch('/delivery/cancel-send/:purchaseId', auth('admin'), controller.markAsNotSent);
router.get('/deliveries-requested', auth('admin'), controller.getAllDeliveriesRequested);

module.exports = router;module.exports = router;
