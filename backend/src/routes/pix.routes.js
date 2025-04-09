const controller = require('../controllers/pix.controller');


const router = require('express').Router();

router.post('/pix', controller.generatePix);

module.exports = router;