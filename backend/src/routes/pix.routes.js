const express = require('express');
const router = express.Router();
const pixGenerator = require('../controllers/pixGenerator.controller');
const pixKeysController = require('../controllers/pixKeys.controller');

router.post('/generate', pixGenerator.generatePix);

// PIX Keys routes
router.get('/keys', pixKeysController.getAllPixKeys);
router.get('/keys/available', pixKeysController.getAvailablePixKeys);
router.get('/keys/:id', pixKeysController.getPixKeyById);
router.post('/keys', pixKeysController.createPixKey);
router.put('/keys/:id', pixKeysController.updatePixKey);
router.put('/keys/:id/main', pixKeysController.setMainPixKey);
router.delete('/keys/:id', pixKeysController.deletePixKey);

module.exports = router;
