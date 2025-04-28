const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.get('/methods', paymentController.getAllPaymentMethods);
router.get('/methods/active', paymentController.getActivePaymentMethod);
router.put('/methods/active', paymentController.setActivePaymentMethod);

router.get('/monthly', paymentController.getMonthlyData);
router.get('/export', paymentController.exportMonthlyData);

module.exports = router;