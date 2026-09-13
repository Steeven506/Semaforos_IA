const IAService = require('../services/iaService');

class IAController {
  static async getSugerencias(req, res) {
    try {
      const sugerencias = await IAService.generarSugerencias(req.params.interseccion_id);
      res.json(sugerencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getReporte(req, res) {
    try {
      const { fecha } = req.query;
      const reporte = await IAService.generarReporteDiario(
        req.params.interseccion_id,
        fecha || new Date().toISOString().split('T')[0]
      );
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPrediccion(req, res) {
    try {
      const prediccion = await IAService.predecirFlujo(req.params.interseccion_id);
      res.json(prediccion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDecisiones(req, res) {
    try {
      const decisiones = await IAService.obtenerDecisiones(req.params.interseccion_id);
      res.json(decisiones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createDecision(req, res) {
    try {
      const { interseccion_id, grupo_id, ...decision } = req.body;
      const result = await IAService.guardarDecision(interseccion_id, grupo_id, decision);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getReporteSemanal(req, res) {
    try {
      const reporte = await IAService.generarReporteIA(req.params.interseccion_id);
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IAController;