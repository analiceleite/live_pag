const controller = require('../controllers/client.controller');
const auth = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/create', auth('admin'), controller.createClient);
router.get('/get-all', auth('admin'), controller.getAllClients);
router.put('/edit/:id', auth('admin'), controller.editClient);
router.delete('/delete/:id', auth('admin'), controller.deleteClient);

module.exports = router;


