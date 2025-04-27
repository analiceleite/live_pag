const controller = require('../controllers/pix.controller');


const router = require('express').Router();

router.post('/generate', controller.generatePix);

module.exports = router;