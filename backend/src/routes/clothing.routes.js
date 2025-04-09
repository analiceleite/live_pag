// src/routes/pecas.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/clothing.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/clothings', auth('admin'), controller.createClothing);
router.get('/clothings', auth('admin'), controller.getAllClothings);

module.exports = router;
