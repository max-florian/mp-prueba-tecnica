const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedientes');
const auth = require('../middleware/autenticacion');


router.get('/', auth, expedienteController.obtenerExpedientes);
router.get('/:id', auth, expedienteController.obtenerExpedientePorId);
router.post('/crear', auth, expedienteController.crearExpediente);
router.put('/:id', auth, expedienteController.editarExpediente);
router.delete('/:id', auth, expedienteController.eliminarExpediente);
router.put('/:id/estado', auth, expedienteController.cambiarEstadoExpediente); // Gestión de Estado (Aprobar/Rechazar)

module.exports = router;