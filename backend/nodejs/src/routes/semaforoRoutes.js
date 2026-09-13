const express = require('express');
const router = express.Router();
const SemaforoController = require('../controllers/semaforoController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, SemaforoController.getAll);
router.get('/intersection/:interseccion_id', authenticateToken, SemaforoController.getByIntersection);
router.get('/:id', authenticateToken, SemaforoController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), SemaforoController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), SemaforoController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), SemaforoController.delete);

module.exports = router;