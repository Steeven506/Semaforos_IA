const express = require('express');
const router = express.Router();
const IAController = require('../controllers/iaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/analisis/:interseccion_id', authenticateToken, IAController.analizarTrafico);

router.post('/decision', authenticateToken, authorizeRoles('admin', 'operador'), IAController.tomarDecision);
router.get('/decisiones/:interseccion_id', authenticateToken, IAController.getDecisiones);
router.get('/estadisticas/:interseccion_id', authenticateToken, IAController.getEstadisticasDecisiones);

router.post('/control/semaforo', authenticateToken, authorizeRoles('admin'), IAController.cambiarEstadoSemaforo);
router.post('/control/grupo', authenticateToken, authorizeRoles('admin'), IAController.cambiarEstadoGrupo);
router.get('/estados/:interseccion_id', authenticateToken, IAController.getEstadosSemaforos);
router.get('/estado-grupo/:grupo_id', authenticateToken, IAController.getEstadoGrupo);
router.get('/control-reciente/:interseccion_id', authenticateToken, IAController.getControlReciente);

router.get('/reporte/:interseccion_id', authenticateToken, IAController.getReporte);
router.get('/reporte-semanal/:interseccion_id', authenticateToken, IAController.getReporteSemanal);
router.get('/prediccion/:interseccion_id', authenticateToken, IAController.getPrediccion);
router.get('/sugerencias/:interseccion_id', authenticateToken, IAController.getSugerencias);

module.exports = router;