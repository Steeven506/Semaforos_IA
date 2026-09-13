const Emergencia = require('../models/Emergencia');
const Intersection = require('../models/Intersection');
const { emitNewEmergencia } = require('../websocket/server');

const TIPOS_VALIDOS = ['ambulancia', 'bomberos', 'policia', 'otro'];
const ESTADOS_VALIDOS = ['activa', 'resuelta', 'cancelada'];

class EmergenciaService {
  static async create(data) {
    if (!data.interseccion_id) {
      throw new Error('El ID de la interseccion es requerido');
    }
    if (!data.tipo) {
      throw new Error('El tipo es requerido');
    }
    if (!TIPOS_VALIDOS.includes(data.tipo)) {
      throw new Error(`Tipo no valido. Usa: ${TIPOS_VALIDOS.join(', ')}`);
    }

    const intersection = await Intersection.findById(data.interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }

    const emergencia = await Emergencia.create({
      interseccion_id: data.interseccion_id,
      tipo: data.tipo,
      descripcion: data.descripcion || null,
      estado: data.estado || 'activa'
    });

    emitNewEmergencia(emergencia);

    return emergencia;
  }

  static async findAll() {
    return await Emergencia.findAll();
  }

  static async findById(id) {
    const emergencia = await Emergencia.findById(id);
    if (!emergencia) {
      throw new Error('Emergencia no encontrada');
    }
    return emergencia;
  }

  static async findByIntersection(interseccion_id) {
    const intersection = await Intersection.findById(interseccion_id);
    if (!intersection) {
      throw new Error('Interseccion no encontrada');
    }
    return await Emergencia.findByIntersection(interseccion_id);
  }

  static async findActivas() {
    return await Emergencia.findActivas();
  }

  static async update(id, data) {
    const emergencia = await Emergencia.findById(id);
    if (!emergencia) {
      throw new Error('Emergencia no encontrada');
    }

    if (data.tipo && !TIPOS_VALIDOS.includes(data.tipo)) {
      throw new Error(`Tipo no valido. Usa: ${TIPOS_VALIDOS.join(', ')}`);
    }

    if (data.estado && !ESTADOS_VALIDOS.includes(data.estado)) {
      throw new Error(`Estado no valido. Usa: ${ESTADOS_VALIDOS.join(', ')}`);
    }

    return await Emergencia.update(id, data);
  }

  static async delete(id) {
    const emergencia = await Emergencia.findById(id);
    if (!emergencia) {
      throw new Error('Emergencia no encontrada');
    }

    return await Emergencia.delete(id);
  }
}

module.exports = EmergenciaService;