const controller = require('../controllers/mining.controller');
const auth = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/create', auth('admin'), controller.createMining);
router.get('/get-all', auth('admin'), controller.getAllMinings);
router.put('/edit/:id', auth('admin'), controller.editMining);
router.delete('/delete/:id', auth('admin'), controller.deleteMining);

module.exports = router;


