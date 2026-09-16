const IAService = require('../services/iaService');

class IAController {
  static async analizarTrafico(req, res) {
    try {
      const { interseccion_id } = req.params;
      const { horas } = req.query;
      const analisis = await IAService.analizarTrafico(interseccion_id, horas ? parseInt(horas) : 24);
      res.json(analisis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async tomarDecision(req, res) {
    try {
      const { interseccion_id, grupo_id } = req.body;
      const result = await IAService.tomarDecision(interseccion_id, grupo_id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
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

  static async getEstadisticasDecisiones(req, res) {
    try {
      const stats = await IAService.obtenerEstadisticasDecisiones(req.params.interseccion_id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarEstadoSemaforo(req, res) {
    try {
      const { semaforo_id, estado } = req.body;
      const usuario_id = req.user.id;
      const control = await IAService.cambiarEstadoSemaforo(semaforo_id, estado, usuario_id);
      res.json({
        message: 'Estado del semaforo cambiado exitosamente',
        control
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async cambiarEstadoGrupo(req, res) {
    try {
      const { grupo_id, estado } = req.body;
      const usuario_id = req.user.id;
      const result = await IAService.cambiarEstadoGrupo(grupo_id, estado, usuario_id);
      res.json({
        message: 'Estado del grupo cambiado exitosamente',
        result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getEstadosSemaforos(req, res) {
    try {
      const estados = await IAService.obtenerEstadosSemaforos(req.params.interseccion_id);
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEstadoGrupo(req, res) {
    try {
      const estado = await IAService.obtenerEstadoGrupo(req.params.grupo_id);
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getControlReciente(req, res) {
    try {
      const controles = await IAService.obtenerControlReciente(req.params.interseccion_id);
      res.json(controles);
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

  static async getReporteSemanal(req, res) {
    try {
      const reporte = await IAService.generarReporteSemanal(req.params.interseccion_id);
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

  static async getSugerencias(req, res) {
    try {
      const sugerencias = await IAService.generarSugerencias(req.params.interseccion_id);
      res.json(sugerencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IAController;