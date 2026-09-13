const express = require('express');
const router = express.Router();
const IAController = require('../controllers/iaController');
const { authenticateToken } = require('../middleware/auth');

router.get('/sugerencias/:interseccion_id', authenticateToken, IAController.getSugerencias);
router.get('/reporte/:interseccion_id', authenticateToken, IAController.getReporte);
router.get('/prediccion/:interseccion_id', authenticateToken, IAController.getPrediccion);
router.get('/decisiones/:interseccion_id', authenticateToken, IAController.getDecisiones);
router.get('/reporte-semanal/:interseccion_id', authenticateToken, IAController.getReporteSemanal);
router.post('/decision', authenticateToken, IAController.createDecision);

module.exports = router;