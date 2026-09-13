const FaseService = require('../services/faseService');

class FaseController {
  static async create(req, res) {
    try {
      const fase = await FaseService.create(req.body);
      res.status(201).json({
        message: 'Fase creada exitosamente',
        fase
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const fases = await FaseService.findAll();
      res.json(fases);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const fase = await FaseService.findById(req.params.id);
      res.json(fase);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getBySemaforo(req, res) {
    try {
      const fases = await FaseService.findBySemaforo(req.params.semaforo_id);
      res.json(fases);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const fase = await FaseService.update(req.params.id, req.body);
      res.json({
        message: 'Fase actualizada exitosamente',
        fase
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const fase = await FaseService.delete(req.params.id);
      res.json({
        message: 'Fase eliminada exitosamente',
        fase
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteBySemaforo(req, res) {
    try {
      const fases = await FaseService.deleteBySemaforo(req.params.semaforo_id);
      res.json({
        message: 'Fases eliminadas exitosamente',
        total: fases.length,
        fases
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FaseController;