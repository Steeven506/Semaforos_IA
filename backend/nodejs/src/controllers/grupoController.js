const GrupoService = require('../services/grupoService');

class GrupoController {
  static async create(req, res) {
    try {
      const grupo = await GrupoService.create(req.body);
      res.status(201).json({
        message: 'Grupo creado exitosamente',
        grupo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const grupos = await GrupoService.findAll();
      res.json(grupos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const grupo = await GrupoService.findById(req.params.id);
      res.json(grupo);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByIntersection(req, res) {
    try {
      const grupos = await GrupoService.findByIntersection(req.params.interseccion_id);
      res.json(grupos);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const grupo = await GrupoService.update(req.params.id, req.body);
      res.json({
        message: 'Grupo actualizado exitosamente',
        grupo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const grupo = await GrupoService.delete(req.params.id);
      res.json({
        message: 'Grupo eliminado exitosamente',
        grupo
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getSincronizacion(req, res) {
    try {
      const sincronizacion = await GrupoService.getSincronizacion(req.params.interseccion_id);
      res.json(sincronizacion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSincronizacion(req, res) {
    try {
      const sincronizacion = await GrupoService.createSincronizacion(req.body);
      res.status(201).json({
        message: 'Sincronizacion creada exitosamente',
        sincronizacion
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSincronizacion(req, res) {
    try {
      const sincronizacion = await GrupoService.deleteSincronizacion(req.params.id);
      res.json({
        message: 'Sincronizacion eliminada exitosamente',
        sincronizacion
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = GrupoController;