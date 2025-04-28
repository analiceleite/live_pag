// src/routes/pecas.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/clothing.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/create', auth('admin'), controller.createClothing);
router.get('/get-all', auth('admin'), controller.getAllClothings);
router.put('/edit/:id', auth('admin'), controller.editClothing);
router.delete('/delete/:id', auth('admin'), controller.deleteClothing);

module.exports = router;
