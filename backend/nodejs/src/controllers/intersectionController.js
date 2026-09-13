const IntersectionService = require('../services/intersectionService');

class IntersectionController {
  static async create(req, res) {
    try {
      const intersection = await IntersectionService.create(req.body, req.user.id);
      res.status(201).json({
        message: 'Interseccion creada exitosamente',
        intersection
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const intersections = await IntersectionService.findAll();
      res.json(intersections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const intersection = await IntersectionService.findById(req.params.id);
      res.json(intersection);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getMyIntersections(req, res) {
    try {
      const intersections = await IntersectionService.findByUser(req.user.id);
      res.json(intersections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const intersection = await IntersectionService.update(req.params.id, req.body);
      res.json({
        message: 'Interseccion actualizada exitosamente',
        intersection
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const intersection = await IntersectionService.delete(req.params.id);
      res.json({
        message: 'Interseccion eliminada exitosamente',
        intersection
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await IntersectionService.getStats(req.params.id);
      res.json(stats);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = IntersectionController;