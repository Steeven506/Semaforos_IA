const express = require('express');
const router = express.Router();
const IntersectionController = require('../controllers/intersectionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, IntersectionController.getAll);
router.get('/my', authenticateToken, IntersectionController.getMyIntersections);
router.get('/:id', authenticateToken, IntersectionController.getById);
router.get('/:id/stats', authenticateToken, IntersectionController.getStats);

router.post('/', authenticateToken, authorizeRoles('admin', 'operador'), IntersectionController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'operador'), IntersectionController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), IntersectionController.delete);

module.exports = router;