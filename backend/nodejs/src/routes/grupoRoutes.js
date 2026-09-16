const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/grupoController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, GrupoController.getAll);
router.get('/interseccion/:interseccion_id', authenticateToken, GrupoController.getByIntersection);
router.get('/:id', authenticateToken, GrupoController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), GrupoController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), GrupoController.update);
router.put('/:id/tiempos', authenticateToken, authorizeRoles('admin'), GrupoController.actualizarTiempos);
router.post('/:id/estado', authenticateToken, authorizeRoles('admin'), GrupoController.cambiarEstado);
router.post('/:id/automatico', authenticateToken, authorizeRoles('admin'), GrupoController.activarModoAutomatico);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), GrupoController.delete);

module.exports = router;