const express = require('express');
const router = express.Router();
const indicioController = require('../controllers/indicios');
const auth = require('../middleware/autenticacion');


router.post('/crear', auth, indicioController.crearIndicio);
router.get('/expediente/:id_expediente', auth, indicioController.obtenerIndiciosPorExpediente);
router.get('/:id', auth, indicioController.obtenerIndicioPorId);
router.put('/:id', auth, indicioController.editarIndicio);
router.delete('/:id', auth, indicioController.eliminarIndicio);

module.exports = router;