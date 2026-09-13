const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/grupoController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, GrupoController.getAll);
router.get('/interseccion/:interseccion_id', authenticateToken, GrupoController.getByIntersection);
router.get('/sincronizacion/:interseccion_id', authenticateToken, GrupoController.getSincronizacion);
router.get('/:id', authenticateToken, GrupoController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), GrupoController.create);
router.post('/sincronizacion', authenticateToken, authorizeRoles('admin', 'operador'), GrupoController.createSincronizacion);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), GrupoController.update);
router.delete('/sincronizacion/:id', authenticateToken, authorizeRoles('admin'), GrupoController.deleteSincronizacion);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), GrupoController.delete);

module.exports = router;