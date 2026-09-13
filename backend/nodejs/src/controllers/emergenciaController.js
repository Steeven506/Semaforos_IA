const EmergenciaService = require('../services/emergenciaService');

class EmergenciaController {
  static async create(req, res) {
    try {
      const emergencia = await EmergenciaService.create(req.body);
      res.status(201).json({
        message: 'Emergencia registrada exitosamente',
        emergencia
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const emergencias = await EmergenciaService.findAll();
      res.json(emergencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const emergencia = await EmergenciaService.findById(req.params.id);
      res.json(emergencia);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByIntersection(req, res) {
    try {
      const emergencias = await EmergenciaService.findByIntersection(req.params.interseccion_id);
      res.json(emergencias);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getActivas(req, res) {
    try {
      const emergencias = await EmergenciaService.findActivas();
      res.json(emergencias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const emergencia = await EmergenciaService.update(req.params.id, req.body);
      res.json({
        message: 'Emergencia actualizada exitosamente',
        emergencia
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const emergencia = await EmergenciaService.delete(req.params.id);
      res.json({
        message: 'Emergencia eliminada exitosamente',
        emergencia
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EmergenciaController;