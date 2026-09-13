const Camera = require('../models/Camera');
const Intersection = require('../models/Intersection');
const GrupoSemaforo = require('../models/GrupoSemaforo');

class CameraService {
  static async create(data) {
    if (!data.name) {
      throw new Error('El nombre es requerido');
    }
    if (!data.url) {
      throw new Error('La URL es requerida');
    }

    if (data.interseccion_id) {
      const intersection = await Intersection.findById(data.interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }

    if (data.grupo_id) {
      const grupo = await GrupoSemaforo.findById(data.grupo_id);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
    }

    return await Camera.create({
      interseccion_id: data.interseccion_id || null,
      sensor_id: data.sensor_id || null,
      grupo_id: data.grupo_id || null,
      name: data.name,
      url: data.url,
      camera_type: data.camera_type || 'webcam',
      activo: data.activo !== undefined ? data.activo : true
    });
  }

  static async findAll() {
    return await Camera.findAll();
  }

  static async findById(id) {
    const camera = await Camera.findById(id);
    if (!camera) {
      throw new Error('Camara no encontrada');
    }
    return camera;
  }

  static async findByIntersection(interseccion_id) {
    const intersection = await Intersection.findById(interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return await Camera.findByIntersection(interseccion_id);
  }

  static async findByGrupo(grupo_id) {
    const grupo = await GrupoSemaforo.findById(grupo_id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }
    return await Camera.findByGrupo(grupo_id);
  }

  static async update(id, data) {
    const camera = await Camera.findById(id);
    if (!camera) {
      throw new Error('Camara no encontrada');
    }

    if (data.interseccion_id) {
      const intersection = await Intersection.findById(data.interseccion_id);
      if (!intersection) {
        throw new Error('Interseccion no encontrada');
      }
    }

    if (data.grupo_id) {
      const grupo = await GrupoSemaforo.findById(data.grupo_id);
      if (!grupo) {
        throw new Error('Grupo no encontrado');
      }
    }

    return await Camera.update(id, data);
  }

  static async delete(id) {
    const camera = await Camera.findById(id);
    if (!camera) {
      throw new Error('Camara no encontrada');
    }

    return await Camera.delete(id);
  }
}

module.exports = CameraService;