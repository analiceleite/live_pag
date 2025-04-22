const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth.middleware');

// Purchase
router.post('/purchase', auth('admin'), controller.createPurchase);

// Payments
router.get('/pendencies', auth('admin'), controller.getAllPendencies);
router.get('/pendencies-by-client/:clientId', auth('user'), controller.getPendenciesByClient);
router.put('/mark-as-paid/:purchaseId', auth('admin'), controller.markAsPaid);
router.patch('/mark-as-unpaid/:purchaseId', auth('admin'), controller.markAsUnpaid);
router.put('/mark-as-deleted/:purchaseId', auth('admin'), controller.markAsDeleted);
router.patch('/mark-as-undeleted/:purchaseId', auth('admin'), controller.markAsUndeleted);

// Delivery
router.put('/delivery/request/:purchaseId', auth('user'), controller.markAsDeliveryRequested);
router.put('/delivery/send/:purchaseId', auth('admin'), controller.markAsSent);
router.put('/delivery/cancel-send/:purchaseId', auth('admin'), controller.markAsNotSent);
router.get('/deliveries-requested', auth('admin'), controller.getAllDeliveriesRequested);

module.exports = router;
