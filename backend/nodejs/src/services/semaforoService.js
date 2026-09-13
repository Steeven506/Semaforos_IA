const Semaforo = require('../models/Semaforo');
const Intersection = require('../models/Intersection');

class SemaforoService {
  static async create(data) {
    if (!data.interseccion_id) {
      throw new Error('El ID de la interseccion es requerido');
    }
    if (!data.nombre) {
      throw new Error('El nombre es requerido');
    }
    if (!data.tipo) {
      throw new Error('El tipo es requerido');
    }

    const intersection = await Intersection.findById(data.interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    return await Semaforo.create({
      interseccion_id: data.interseccion_id,
      nombre: data.nombre,
      tipo: data.tipo,
      estado: data.estado || 'activo',
      latitud: data.latitud || null,
      longitud: data.longitud || null
    });
  }

  static async findAll() {
    return await Semaforo.findAll();
  }

  static async findById(id) {
    const semaforo = await Semaforo.findById(id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }
    return semaforo;
  }

  static async findByIntersection(interseccion_id) {
    const intersection = await Intersection.findById(interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return await Semaforo.findByIntersection(interseccion_id);
  }

  static async update(id, data) {
    const semaforo = await Semaforo.findById(id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }

    return await Semaforo.update(id, data);
  }

  static async delete(id) {
    const semaforo = await Semaforo.findById(id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }

    return await Semaforo.delete(id);
  }
}

module.exports = SemaforoService;