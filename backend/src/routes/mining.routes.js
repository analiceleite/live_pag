const controller = require('../controllers/mining.controller');
const auth = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/mining', auth('admin'), controller.createMining);
router.get('/mining', auth('admin'), controller.getAllMinings);
router.put('/mining/:id', auth('admin'), controller.editMining);
router.delete('/mining/:id', auth('admin'), controller.deleteMining);

module.exports = router;


