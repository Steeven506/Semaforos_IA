const Intersection = require('../models/Intersection');

class IntersectionService {
  static async create(data, usuario_id) {
    if (!data.nombre) {
      throw new Error('El nombre es requerido');
    }

    return await Intersection.create({
      usuario_id,
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      latitud: data.latitud || null,
      longitud: data.longitud || null,
      direccion: data.direccion || null,
      ciudad: data.ciudad || null,
      pais: data.pais || null
    });
  }

  static async findAll() {
    return await Intersection.findAll();
  }

  static async findById(id) {
    const intersection = await Intersection.findById(id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return intersection;
  }

  static async findByUser(usuario_id) {
    return await Intersection.findByUser(usuario_id);
  }

  static async update(id, data) {
    const intersection = await Intersection.findById(id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    return await Intersection.update(id, data);
  }

  static async delete(id) {
    const intersection = await Intersection.findById(id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    return await Intersection.delete(id);
  }

  static async getStats(id) {
    const intersection = await Intersection.findById(id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    return await Intersection.getStats(id);
  }
}

module.exports = IntersectionService;