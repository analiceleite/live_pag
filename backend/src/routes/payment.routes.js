const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');


router.get('/get-payment-method', paymentController.getAllPaymentMethods);
router.get('/get-active-payment-method', paymentController.getActivePaymentMethod);
router.post('/set-active-payment-method', paymentController.setActivePaymentMethod);


module.exports = router;