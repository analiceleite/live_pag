const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth.middleware');


router.post('/purchase', auth('admin'), controller.createPurchase);
router.get('/pendencies', auth('admin'), controller.getAllPendencies);
router.get('/pendencies-by-client/:clienteId', auth('usuario'), controller.getPendenciesByClient);
router.put('/mark-as-paid/:compraId', controller.markAsPaid);
router.patch('/mark-as-unpaid/:compraId', controller.markAsUnpaid);

module.exports = router;