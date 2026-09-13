const express = require('express');
const router = express.Router();
const CameraController = require('../controllers/cameraController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, CameraController.getAll);
router.get('/interseccion/:interseccion_id', authenticateToken, CameraController.getByIntersection);
router.get('/grupo/:grupo_id', authenticateToken, CameraController.getByGrupo);
router.get('/:id', authenticateToken, CameraController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), CameraController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), CameraController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), CameraController.delete);

module.exports = router;