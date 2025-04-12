const controller = require('../controllers/client.controller');
const auth = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/clients', auth('admin'), controller.createClient);
router.get('/clients', auth('admin'), controller.getAllClients);
router.put('/clients/:id', auth('admin'), controller.editClient);
router.delete('/clients/:id', auth('admin'), controller.deleteClient);

module.exports = router;


