const CameraService = require('../services/cameraService');

class CameraController {
  static async create(req, res) {
    try {
      const camera = await CameraService.create(req.body);
      res.status(201).json({
        message: 'Camara creada exitosamente',
        camera
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const cameras = await CameraService.findAll();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const camera = await CameraService.findById(req.params.id);
      res.json(camera);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByIntersection(req, res) {
    try {
      const cameras = await CameraService.findByIntersection(req.params.interseccion_id);
      res.json(cameras);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getByGrupo(req, res) {
    try {
      const cameras = await CameraService.findByGrupo(req.params.grupo_id);
      res.json(cameras);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const camera = await CameraService.update(req.params.id, req.body);
      res.json({
        message: 'Camara actualizada exitosamente',
        camera
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const camera = await CameraService.delete(req.params.id);
      res.json({
        message: 'Camara eliminada exitosamente',
        camera
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CameraController;