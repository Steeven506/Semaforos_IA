const express = require('express');
const router = express.Router();
const DetectionController = require('../controllers/detectionController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, DetectionController.getAll);
router.get('/stats/today', authenticateToken, DetectionController.getTodayStats);
router.get('/stats/hourly', authenticateToken, DetectionController.getHourlyStats);
router.get('/stats/summary', authenticateToken, DetectionController.getSummary);
router.get('/camera/:camera_id', authenticateToken, DetectionController.getByCamera);
router.get('/interseccion/:interseccion_id', authenticateToken, DetectionController.getByIntersection);
router.get('/range', authenticateToken, DetectionController.getByDateRange);
router.get('/:id', authenticateToken, DetectionController.getById);

router.post('/', authenticateToken, DetectionController.create);
router.delete('/old', authenticateToken, authorizeRoles('admin'), DetectionController.deleteOld);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), DetectionController.delete);

module.exports = router;