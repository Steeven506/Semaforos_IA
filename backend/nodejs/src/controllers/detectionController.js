const DetectionService = require('../services/detectionService');

class DetectionController {
  static async create(req, res) {
    try {
      const detection = await DetectionService.create(req.body);
      res.status(201).json({
        message: 'Deteccion registrada exitosamente',
        detection
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const detections = await DetectionService.findAll(limit);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const detection = await DetectionService.findById(req.params.id);
      res.json(detection);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByCamera(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const detections = await DetectionService.findByCamera(req.params.camera_id, limit);
      res.json(detections);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByIntersection(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const detections = await DetectionService.findByIntersection(req.params.interseccion_id, limit);
      res.json(detections);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByDateRange(req, res) {
    try {
      const { start, end } = req.query;
      const detections = await DetectionService.findByDateRange(start, end);
      res.json(detections);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTodayStats(req, res) {
    try {
      const interseccion_id = req.query.interseccion_id ? parseInt(req.query.interseccion_id) : null;
      const stats = await DetectionService.getTodayStats(interseccion_id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getHourlyStats(req, res) {
    try {
      const interseccion_id = req.query.interseccion_id ? parseInt(req.query.interseccion_id) : null;
      const stats = await DetectionService.getHourlyStats(interseccion_id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSummary(req, res) {
    try {
      const interseccion_id = req.query.interseccion_id ? parseInt(req.query.interseccion_id) : null;
      const summary = await DetectionService.getSummary(interseccion_id);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const detection = await DetectionService.delete(req.params.id);
      res.json({
        message: 'Deteccion eliminada exitosamente',
        detection
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteOld(req, res) {
    try {
      const days = req.query.days ? parseInt(req.query.days) : 30;
      const deleted = await DetectionService.deleteOld(days);
      res.json({
        message: `Detecciones antiguas eliminadas (${days} dias)`,
        total: deleted.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DetectionController;