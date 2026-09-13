const Detection = require('../models/Detection');
const Camera = require('../models/Camera');
const Intersection = require('../models/Intersection');
const { emitNewDetection, emitStatsUpdate } = require('../websocket/server');

class DetectionService {
  static async create(data) {
    if (!data.camera_id) {
      throw new Error('El ID de la camara es requerido');
    }

    const camera = await Camera.findById(data.camera_id);
    if (!camera) {
      throw new Error('Camara no encontrada');
    }

    let interseccion_id = data.interseccion_id || camera.interseccion_id;
    let sensor_id = data.sensor_id || camera.sensor_id;

    if (interseccion_id) {
      const intersection = await Intersection.findById(interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }

    const detection = await Detection.create({
      camera_id: data.camera_id,
      interseccion_id,
      sensor_id,
      personas: data.personas || 0,
      carros: data.carros || 0,
      motos: data.motos || 0,
      buses: data.buses || 0,
      camiones: data.camiones || 0
    });

    emitNewDetection(detection);

    try {
      const stats = await Detection.getTodayStats(interseccion_id);
      emitStatsUpdate(stats, interseccion_id);
    } catch (error) {
      console.error('Error emitiendo stats:', error);
    }

    return detection;
  }

  static async findAll(limit) {
    return await Detection.findAll(limit);
  }

  static async findById(id) {
    const detection = await Detection.findById(id);
    if (!detection) {
      throw new Error('Deteccion no encontrada');
    }
    return detection;
  }

  static async findByCamera(camera_id, limit) {
    const camera = await Camera.findById(camera_id);
    if (!camera) {
      throw new Error('Camara no encontrada');
    }
    return await Detection.findByCamera(camera_id, limit);
  }

  static async findByIntersection(interseccion_id, limit) {
    const intersection = await Intersection.findById(interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return await Detection.findByIntersection(interseccion_id, limit);
  }

  static async findByDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }
    return await Detection.findByDateRange(startDate, endDate);
  }

  static async getTodayStats(interseccion_id) {
    if (interseccion_id) {
      const intersection = await Intersection.findById(interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }
    return await Detection.getTodayStats(interseccion_id);
  }

  static async getHourlyStats(interseccion_id) {
    if (interseccion_id) {
      const intersection = await Intersection.findById(interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }
    return await Detection.getHourlyStats(interseccion_id);
  }

  static async getSummary(interseccion_id) {
    if (interseccion_id) {
      const intersection = await Intersection.findById(interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }
    return await Detection.getSummary(interseccion_id);
  }

  static async delete(id) {
    const detection = await Detection.findById(id);
    if (!detection) {
      throw new Error('Deteccion no encontrada');
    }
    return await Detection.delete(id);
  }

  static async deleteOld(days) {
    return await Detection.deleteOld(days);
  }
}

module.exports = DetectionService;