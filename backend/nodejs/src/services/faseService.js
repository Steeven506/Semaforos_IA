const Fase = require('../models/Fase');
const Semaforo = require('../models/Semaforo');

class FaseService {
  static async create(data) {
    if (!data.semaforo_id) {
      throw new Error('El ID del semaforo es requerido');
    }
    if (!data.nombre) {
      throw new Error('El nombre es requerido');
    }
    if (data.duracion === undefined || data.duracion === null) {
      throw new Error('La duracion es requerida');
    }
    if (data.duracion <= 0) {
      throw new Error('La duracion debe ser mayor a 0');
    }
    if (data.orden === undefined || data.orden === null) {
      throw new Error('El orden es requerido');
    }

    const semaforo = await Semaforo.findById(data.semaforo_id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }

    return await Fase.create({
      semaforo_id: data.semaforo_id,
      nombre: data.nombre,
      duracion: data.duracion,
      orden: data.orden,
      color: data.color || 'verde'
    });
  }

  static async findAll() {
    return await Fase.findAll();
  }

  static async findById(id) {
    const fase = await Fase.findById(id);
    if (!fase) {
      throw new Error('Fase no encontrada');
    }
    return fase;
  }

  static async findBySemaforo(semaforo_id) {
    const semaforo = await Semaforo.findById(semaforo_id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }
    return await Fase.findBySemaforo(semaforo_id);
  }

  static async update(id, data) {
    const fase = await Fase.findById(id);
    if (!fase) {
      throw new Error('Fase no encontrada');
    }

    if (data.duracion !== undefined && data.duracion <= 0) {
      throw new Error('La duracion debe ser mayor a 0');
    }

    return await Fase.update(id, data);
  }

  static async delete(id) {
    const fase = await Fase.findById(id);
    if (!fase) {
      throw new Error('Fase no encontrada');
    }

    return await Fase.delete(id);
  }

  static async deleteBySemaforo(semaforo_id) {
    const semaforo = await Semaforo.findById(semaforo_id);
    if (!semaforo) {
      throw new Error('Semaforo no encontrado');
    }

    return await Fase.deleteBySemaforo(semaforo_id);
  }
}

module.exports = FaseService;