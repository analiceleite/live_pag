const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchase.controller');
const auth = require('../middlewares/auth.middleware');


router.post('/purchase', auth('admin'), controller.createPurchase);
router.get('/pendencies', auth('admin'), controller.getAllPendencies);

module.exports = router;