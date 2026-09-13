const express = require('express');
const router = express.Router();
const FaseController = require('../controllers/faseController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, FaseController.getAll);
router.get('/semaforo/:semaforo_id', authenticateToken, FaseController.getBySemaforo);
router.get('/:id', authenticateToken, FaseController.getById);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), FaseController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), FaseController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), FaseController.delete);
router.delete('/semaforo/:semaforo_id', authenticateToken, authorizeRoles('admin'), FaseController.deleteBySemaforo);

module.exports = router;