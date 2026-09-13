const express = require('express');
const router = express.Router();
const EmergenciaController = require('../controllers/emergenciaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, EmergenciaController.getAll);
router.get('/activas', authenticateToken, EmergenciaController.getActivas);
router.get('/interseccion/:interseccion_id', authenticateToken, EmergenciaController.getByIntersection);
router.get('/:id', authenticateToken, EmergenciaController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), EmergenciaController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), EmergenciaController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), EmergenciaController.delete);

module.exports = router;