const SemaforoService = require('../services/semaforoService');

class SemaforoController {
  static async create(req, res) {
    try {
      const semaforo = await SemaforoService.create(req.body);
      res.status(201).json({
        message: 'Semaforo creado exitosamente',
        semaforo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const semaforos = await SemaforoService.findAll();
      res.json(semaforos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const semaforo = await SemaforoService.findById(req.params.id);
      res.json(semaforo);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByIntersection(req, res) {
    try {
      const semaforos = await SemaforoService.findByIntersection(req.params.interseccion_id);
      res.json(semaforos);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const semaforo = await SemaforoService.update(req.params.id, req.body);
      res.json({
        message: 'Semaforo actualizado exitosamente',
        semaforo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const semaforo = await SemaforoService.delete(req.params.id);
      res.json({
        message: 'Semaforo eliminado exitosamente',
        semaforo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SemaforoController;