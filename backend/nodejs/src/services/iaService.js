const db = require('../config/database');
const DecisionIA = require('../models/DecisionIA');
const ControlSemaforo = require('../models/ControlSemaforo');

class IAService {
  static async analizarTrafico(interseccion_id, horas = 24) {
    const query = `
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hora,
        COALESCE(SUM(personas), 0) as personas,
        COALESCE(SUM(carros), 0) as carros,
        COALESCE(SUM(motos), 0) as motos,
        COALESCE(SUM(buses), 0) as buses,
        COALESCE(SUM(camiones), 0) as camiones,
        COALESCE(SUM(total), 0) as total,
        COUNT(*) as registros
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= NOW() - INTERVAL '${horas} hours'
      GROUP BY EXTRACT(HOUR FROM timestamp)
      ORDER BY hora
    `;

    const result = await db.query(query, [interseccion_id]);

    const analisis = {
      interseccion_id,
      periodo_horas: horas,
      datos_por_hora: result.rows,
      resumen: {
        total_personas: 0,
        total_vehiculos: 0,
        hora_pico: null,
        hora_valle: null,
        promedio_por_hora: 0,
        tendencia: 'estable'
      }
    };

    if (result.rows.length > 0) {
      const rows = result.rows;
      let maxTotal = 0;
      let minTotal = Infinity;
      let maxHora = null;
      let minHora = null;
      let sumTotal = 0;

      rows.forEach(row => {
        const total = parseInt(row.total) || 0;
        const personas = parseInt(row.personas) || 0;

        analisis.resumen.total_personas += personas;
        analisis.resumen.total_vehiculos += total;
        sumTotal += total;

        if (total > maxTotal) {
          maxTotal = total;
          maxHora = row.hora;
        }
        if (total < minTotal && total > 0) {
          minTotal = total;
          minHora = row.hora;
        }
      });

      analisis.resumen.hora_pico = maxHora;
      analisis.resumen.hora_valle = minHora;
      analisis.resumen.promedio_por_hora = Math.round(sumTotal / rows.length);

      const mitad = Math.floor(rows.length / 2);
      const primeraMitad = rows.slice(0, mitad).reduce((sum, r) => sum + (parseInt(r.total) || 0), 0);
      const segundaMitad = rows.slice(mitad).reduce((sum, r) => sum + (parseInt(r.total) || 0), 0);

      if (segundaMitad > primeraMitad * 1.2) {
        analisis.resumen.tendencia = 'creciente';
      } else if (segundaMitad < primeraMitad * 0.8) {
        analisis.resumen.tendencia = 'decreciente';
      }
    }

    return analisis;
  }

  static async tomarDecision(interseccion_id, grupo_id = null) {
    const trafico = await this.analizarTrafico(interseccion_id, 2);

    if (!trafico.datos_por_hora || trafico.datos_por_hora.length === 0) {
      return {
        exito: false,
        mensaje: 'No hay datos suficientes para tomar una decision',
        decision: null
      };
    }

    const ultimaHora = trafico.datos_por_hora[trafico.datos_por_hora.length - 1];
    const totalVehiculos = parseInt(ultimaHora.total) || 0;

    const presion = this.calcularPresion(totalVehiculos);
    const tiempoVerde = this.calcularTiempoVerde(presion, totalVehiculos);
    const algoritmo = 'back-pressure';

    let justificacion = '';
    if (totalVehiculos > 20) {
      justificacion = `Alto flujo detectado (${totalVehiculos} vehiculos). Verde extendido a ${tiempoVerde}s`;
    } else if (totalVehiculos > 10) {
      justificacion = `Flujo moderado (${totalVehiculos} vehiculos). Verde a ${tiempoVerde}s`;
    } else {
      justificacion = `Bajo flujo (${totalVehiculos} vehiculos). Verde reducido a ${tiempoVerde}s`;
    }

    let estadoAplicado = null;
    if (grupo_id) {
      estadoAplicado = tiempoVerde > 30 ? 'verde' : 'rojo';
      await this.cambiarEstadoGrupo(grupo_id, estadoAplicado, null);
    }

    const decision = await DecisionIA.create({
      interseccion_id,
      grupo_id,
      accion: 'ajuste_tiempo_verde',
      presion_calculada: presion,
      tiempo_verde: tiempoVerde,
      algoritmo,
      justificacion
    });

    try {
      const { emitDecisionIA } = require('../websocket/server');
      emitDecisionIA(decision);
    } catch (e) {
      console.error('Error emitiendo decision:', e);
    }

    return {
      exito: true,
      mensaje: 'Decision tomada y aplicada exitosamente',
      decision,
      analisis: {
        vehiculos_ultima_hora: totalVehiculos,
        presion_calculada: presion,
        tiempo_verde_sugerido: tiempoVerde,
        estado_aplicado: estadoAplicado
      }
    };
  }

  static calcularPresion(vehiculos) {
    const capacidad = 30;
    const ocupacion = Math.min(vehiculos / capacidad, 1);
    return Math.round(ocupacion * 100) / 100;
  }

  static calcularTiempoVerde(presion, vehiculos) {
    const minVerde = 10;
    const maxVerde = 60;
    const baseVerde = 20;

    let verde = baseVerde + (presion * 30);

    if (vehiculos > 25) {
      verde = Math.min(verde * 1.3, maxVerde);
    } else if (vehiculos < 5) {
      verde = Math.max(verde * 0.7, minVerde);
    }

    return Math.round(Math.max(minVerde, Math.min(verde, maxVerde)));
  }

  static async cambiarEstadoSemaforo(semaforo_id, estado, usuario_id) {
    const semaforo = await db.query(`
      SELECT s.*, g.id as grupo_id, g.interseccion_id
      FROM semaforos s
      LEFT JOIN grupos_semaforos g ON s.grupo_id = g.id
      WHERE s.id = $1
    `, [semaforo_id]);

    if (semaforo.rows.length === 0) {
      throw new Error('Semaforo no encontrado');
    }

    const s = semaforo.rows[0];

    const control = await ControlSemaforo.create({
      semaforo_id,
      grupo_id: s.grupo_id,
      interseccion_id: s.interseccion_id,
      estado,
      origen: 'manual',
      usuario_id
    });

    try {
      const { emitSemaforoCambio } = require('../websocket/server');
      emitSemaforoCambio({
        semaforo_id,
        grupo_id: s.grupo_id,
        interseccion_id: s.interseccion_id,
        estado,
        timestamp: new Date()
      });
    } catch (e) {
      console.error('Error emitiendo cambio:', e);
    }

    return control;
  }

  static async cambiarEstadoGrupo(grupo_id, estado, usuario_id) {
    const semaforos = await db.query(`
      SELECT s.id, s.grupo_id, g.interseccion_id
      FROM semaforos s
      JOIN grupos_semaforos g ON s.grupo_id = g.id
      WHERE s.grupo_id = $1
    `, [grupo_id]);

    if (semaforos.rows.length === 0) {
      throw new Error('No hay semaforos en este grupo');
    }

    const controles = [];

    for (const s of semaforos.rows) {
      const control = await ControlSemaforo.create({
        semaforo_id: s.id,
        grupo_id: s.grupo_id,
        interseccion_id: s.interseccion_id,
        estado,
        origen: 'manual',
        usuario_id
      });
      controles.push(control);
    }

    try {
      const { emitSemaforoCambio } = require('../websocket/server');
      emitSemaforoCambio({
        grupo_id,
        estado,
        interseccion_id: semaforos.rows[0].interseccion_id,
        timestamp: new Date()
      });
    } catch (e) {
      console.error('Error emitiendo cambio:', e);
    }

    return {
      grupo_id,
      estado,
      total_semaforos: controles.length,
      controles
    };
  }

  static async obtenerEstadoGrupo(grupo_id) {
    const query = `
      SELECT estado, timestamp
      FROM control_semaforos
      WHERE grupo_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const result = await db.query(query, [grupo_id]);
    return result.rows[0] || { estado: 'verde', timestamp: null };
  }

  static async obtenerEstadosSemaforos(interseccion_id) {
    const query = `
      SELECT 
        s.id,
        s.nombre,
        s.tipo,
        s.estado,
        s.grupo_id,
        g.nombre as grupo_nombre,
        g.color_grupo,
        c.estado as ultimo_control_estado,
        c.timestamp as ultimo_control_timestamp,
        c.origen as ultimo_control_origen
      FROM semaforos s
      LEFT JOIN grupos_semaforos g ON s.grupo_id = g.id
      LEFT JOIN LATERAL (
        SELECT estado, timestamp, origen
        FROM control_semaforos
        WHERE semaforo_id = s.id
        ORDER BY timestamp DESC
        LIMIT 1
      ) c ON TRUE
      WHERE s.interseccion_id = $1
      ORDER BY s.grupo_id, s.nombre
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async obtenerControlReciente(interseccion_id) {
    const query = `
      SELECT c.*, s.nombre as semaforo_nombre, g.nombre as grupo_nombre, u.nombre as usuario_nombre
      FROM control_semaforos c
      JOIN semaforos s ON c.semaforo_id = s.id
      LEFT JOIN grupos_semaforos g ON c.grupo_id = g.id
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.interseccion_id = $1
      ORDER BY c.timestamp DESC
      LIMIT 20
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async generarReporteDiario(interseccion_id, fecha) {
    const reporte = await db.query(`
      SELECT 
        DATE(timestamp) as fecha,
        SUM(carros) as total_carros,
        SUM(motos) as total_motos,
        SUM(buses) as total_buses,
        SUM(camiones) as total_camiones,
        SUM(personas) as total_personas,
        SUM(total) as total_vehiculos,
        AVG(total) as promedio,
        MAX(total) as maximo,
        COUNT(*) as registros
      FROM detections_log
      WHERE interseccion_id = $1
        AND DATE(timestamp) = $2
      GROUP BY DATE(timestamp)
    `, [interseccion_id, fecha]);

    const horaPico = await db.query(`
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hora,
        SUM(total) as total
      FROM detections_log
      WHERE interseccion_id = $1
        AND DATE(timestamp) = $2
      GROUP BY EXTRACT(HOUR FROM timestamp)
      ORDER BY total DESC
      LIMIT 3
    `, [interseccion_id, fecha]);

    const resumen = reporte.rows[0] || null;

    let analisis = '';
    if (resumen) {
      const totalVehiculos = parseInt(resumen.total_vehiculos) || 0;
      if (totalVehiculos > 500) {
        analisis = 'Dia de alto trafico. Se recomienda revisar los tiempos de semaforo.';
      } else if (totalVehiculos > 200) {
        analisis = 'Dia de trafico moderado. Los tiempos actuales son adecuados.';
      } else {
        analisis = 'Dia de bajo trafico. Se podria optimizar reduciendo tiempos.';
      }
    }

    return { resumen, horas_pico: horaPico.rows, analisis };
  }

  static async generarReporteSemanal(interseccion_id) {
    const stats = await db.query(`
      SELECT 
        SUM(carros) as total_carros,
        SUM(motos) as total_motos,
        SUM(buses) as total_buses,
        SUM(camiones) as total_camiones,
        SUM(personas) as total_personas,
        SUM(total) as total_vehiculos,
        AVG(total) as promedio,
        MAX(total) as maximo
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
    `, [interseccion_id]);

    const dias = await db.query(`
      SELECT 
        DATE(timestamp) as fecha,
        SUM(total) as total
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(timestamp)
      ORDER BY fecha
    `, [interseccion_id]);

    const decisiones = await db.query(`
      SELECT 
        algoritmo,
        AVG(tiempo_verde) as avg_verde,
        COUNT(*) as total
      FROM decisiones_ia
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY algoritmo
    `, [interseccion_id]);

    const sugerencias = [];
    const data = stats.rows[0] || {};
    const totalVehiculos = parseInt(data.total_vehiculos) || 0;

    if (totalVehiculos > 3000) {
      sugerencias.push('Alto flujo semanal. Considerar optimizacion de ciclos base.');
    }

    return {
      periodo: 'ultimos 7 dias',
      totales: data,
      por_dia: dias.rows,
      decisiones_por_algoritmo: decisiones.rows,
      sugerencias
    };
  }

  static async predecirFlujo(interseccion_id) {
    const historico = await db.query(`
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hora,
        AVG(total) as promedio,
        STDDEV(total) as desviacion
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY EXTRACT(HOUR FROM timestamp)
      ORDER BY hora
    `, [interseccion_id]);

    return historico.rows.map(row => {
      const promedio = parseFloat(row.promedio) || 0;
      const desviacion = parseFloat(row.desviacion) || 0;
      const predicho = Math.round(promedio * 1.1);
      const min = Math.round(Math.max(0, predicho - desviacion));
      const max = Math.round(predicho + desviacion);

      let recomendacion = 'Mantener';
      if (promedio > 15) recomendacion = 'Aumentar verde';
      else if (promedio < 5) recomendacion = 'Reducir verde';

      return {
        hora: row.hora,
        flujo_predicho: predicho,
        rango_min: min,
        rango_max: max,
        promedio_historico: Math.round(promedio),
        recomendacion
      };
    });
  }

  static async generarSugerencias(interseccion_id) {
    const stats = await db.query(`
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hora,
        AVG(total) as promedio,
        MAX(total) as maximo,
        COUNT(*) as registros
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM timestamp)
      ORDER BY promedio DESC
    `, [interseccion_id]);

    const sugerencias = [];

    for (const stat of stats.rows) {
      const promedio = parseFloat(stat.promedio);

      if (promedio > 15) {
        sugerencias.push({
          tipo: 'hora_pico',
          hora: stat.hora,
          mensaje: `Hora pico: ${stat.hora}:00 con promedio de ${Math.round(promedio)} vehiculos/min`,
          accion: 'Aumentar tiempo de verde en 10s'
        });
      } else if (promedio < 3) {
        sugerencias.push({
          tipo: 'hora_valle',
          hora: stat.hora,
          mensaje: `Hora valle: ${stat.hora}:00 con promedio de ${Math.round(promedio)} vehiculos/min`,
          accion: 'Reducir tiempo de verde en 5s'
        });
      }
    }

    return sugerencias;
  }

  static async obtenerDecisiones(interseccion_id, limit = 50) {
    return await DecisionIA.findByInterseccion(interseccion_id, limit);
  }

  static async obtenerEstadisticasDecisiones(interseccion_id) {
    return await DecisionIA.getEstadisticas(interseccion_id);
  }
}

module.exports = IAService;