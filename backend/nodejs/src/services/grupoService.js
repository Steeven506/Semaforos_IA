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
      direccion: data.direccion || null,
      tiempo_verde: data.tiempo_verde || 30,
      tiempo_amarillo: data.tiempo_amarillo || 5,
      tiempo_rojo: data.tiempo_rojo || 25,
      offset_segundos: data.offset_segundos || 0
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

  static async cambiarEstado(id, estado) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    const estadosValidos = ['verde', 'amarillo', 'rojo'];
    if (!estadosValidos.includes(estado)) {
      throw new Error('Estado no valido. Usa: verde, amarillo, rojo');
    }

    return await GrupoSemaforo.cambiarEstado(id, estado);
  }

  static async activarModoAutomatico(id) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }
    return await GrupoSemaforo.activarModoAutomatico(id);
  }

  static async actualizarTiempos(id, tiempos) {
    const grupo = await GrupoSemaforo.findById(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    const data = {};
    if (tiempos.tiempo_verde !== undefined) {
      if (tiempos.tiempo_verde < 5 || tiempos.tiempo_verde > 120) {
        throw new Error('Tiempo verde debe estar entre 5 y 120 segundos');
      }
      data.tiempo_verde = tiempos.tiempo_verde;
    }
    if (tiempos.tiempo_amarillo !== undefined) {
      if (tiempos.tiempo_amarillo < 2 || tiempos.tiempo_amarillo > 15) {
        throw new Error('Tiempo amarillo debe estar entre 2 y 15 segundos');
      }
      data.tiempo_amarillo = tiempos.tiempo_amarillo;
    }
    if (tiempos.tiempo_rojo !== undefined) {
      if (tiempos.tiempo_rojo < 5 || tiempos.tiempo_rojo > 120) {
        throw new Error('Tiempo rojo debe estar entre 5 y 120 segundos');
      }
      data.tiempo_rojo = tiempos.tiempo_rojo;
    }

    return await GrupoSemaforo.update(id, data);
  }
}

module.exports = GrupoService;