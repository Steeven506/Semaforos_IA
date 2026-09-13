const db = require('../config/database');

class IAService {
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
      const promedio = parseFloat(resumen.promedio) || 0;

      if (totalVehiculos > 500) {
        analisis = 'Dia de alto trafico. Se recomienda revisar los tiempos de semaforo.';
      } else if (totalVehiculos > 200) {
        analisis = 'Dia de trafico moderado. Los tiempos actuales son adecuados.';
      } else {
        analisis = 'Dia de bajo trafico. Se podria optimizar reduciendo tiempos.';
      }
    }

    return {
      resumen,
      horas_pico: horaPico.rows,
      analisis
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

    const prediccion = historico.rows.map(row => {
      const promedio = parseFloat(row.promedio) || 0;
      const desviacion = parseFloat(row.desviacion) || 0;

      const prediccion = Math.round(promedio * 1.1);
      const min = Math.round(Math.max(0, prediccion - desviacion));
      const max = Math.round(prediccion + desviacion);

      let recomendacion = 'Mantener';
      if (promedio > 15) {
        recomendacion = 'Aumentar verde';
      } else if (promedio < 5) {
        recomendacion = 'Reducir verde';
      }

      return {
        hora: row.hora,
        flujo_predicho: prediccion,
        rango_min: min,
        rango_max: max,
        promedio_historico: Math.round(promedio),
        recomendacion
      };
    });

    return prediccion;
  }

  static async guardarDecision(interseccion_id, grupo_id, decision) {
    const result = await db.query(`
      INSERT INTO decisiones_ia 
      (interseccion_id, grupo_id, accion, presion_calculada, tiempo_verde, algoritmo, justificacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      interseccion_id,
      grupo_id,
      decision.accion || 'ajuste_semaforo',
      decision.presion || 0,
      decision.tiempo_verde,
      decision.algoritmo,
      decision.justificacion || ''
    ]);

    return result.rows[0];
  }

  static async obtenerDecisiones(interseccion_id, limit = 50) {
    const result = await db.query(`
      SELECT * FROM decisiones_ia
      WHERE interseccion_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `, [interseccion_id, limit]);

    return result.rows;
  }

  static async generarReporteIA(interseccion_id) {
    const stats = await db.query(`
      SELECT 
        SUM(carros) as total_carros,
        SUM(motos) as total_motos,
        SUM(buses) as total_buses,
        SUM(camiones) as total_camiones,
        SUM(personas) as total_personas,
        SUM(total) as total_vehiculos
      FROM detections_log
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
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

    const data = stats.rows[0] || {};

    const sugerencias = [];

    const totalVehiculos = parseInt(data.total_vehiculos) || 0;
    if (totalVehiculos > 3000) {
      sugerencias.push('Alto flujo semanal. Considerar optimizacion de ciclos.');
    }

    return {
      periodo: 'ultimos 7 dias',
      totales: data,
      decisiones_por_algoritmo: decisiones.rows,
      sugerencias
    };
  }
}

module.exports = IAService;