const GrupoSemaforo = require('../models/GrupoSemaforo');
const Intersection = require('../models/Intersection');

class GrupoService {
  static async create(data) {
    if (!data.interseccion_id) {
      throw new Error('El ID de la interseccion es requerido');
    }
    if (!data.nombre) {
      throw new Error('El nombre es requerido');
    }

    const intersection = await Intersection.findById(data.interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    return await GrupoSemaforo.create({
      interseccion_id: data.interseccion_id,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      color_grupo: data.color_grupo || 'azul',
      direccion: data.direccion || null
    });
  }

  static async findAll() {
    return await GrupoSemaforo.findAll();
  }

  static async findById(id) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }
    return grupo;
  }

  static async findByIntersection(interseccion_id) {
    const intersection = await Intersection.findById(interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return await GrupoSemaforo.findByIntersection(interseccion_id);
  }

  static async update(id, data) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }
    return await GrupoSemaforo.update(id, data);
  }

  static async delete(id) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }
    return await GrupoSemaforo.delete(id);
  }

  static async getSincronizacion(interseccion_id) {
    return await GrupoSemaforo.getSincronizacion(interseccion_id);
  }

  static async createSincronizacion(data) {
    if (!data.interseccion_id || !data.grupo_a_id || !data.grupo_b_id) {
      throw new Error('Interseccion, grupo A y grupo B son requeridos');
    }
    return await GrupoSemaforo.createSincronizacion(data);
  }

  static async deleteSincronizacion(id) {
    return await GrupoSemaforo.deleteSincronizacion(id);
  }
}

module.exports = GrupoService;