const db = require('../config/database');

class Detection {
  static async create({ camera_id, interseccion_id, sensor_id, personas, carros, motos, buses, camiones }) {
    const total = (personas || 0) + (carros || 0) + (motos || 0) + (buses || 0) + (camiones || 0);
    
    const query = `
      INSERT INTO detections_log 
      (camera_id, interseccion_id, sensor_id, timestamp, personas, carros, motos, buses, camiones, total)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      camera_id, 
      interseccion_id || null, 
      sensor_id || null,
      personas || 0, 
      carros || 0, 
      motos || 0, 
      buses || 0, 
      camiones || 0,
      total
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(limit = 100) {
    const query = `
      SELECT d.*, 
             c.name as camera_nombre,
             i.nombre as interseccion_nombre,
             s.nombre as sensor_nombre
      FROM detections_log d
      LEFT JOIN cameras c ON d.camera_id = c.id
      LEFT JOIN intersecciones i ON d.interseccion_id = i.id
      LEFT JOIN sensores s ON d.sensor_id = s.id
      ORDER BY d.timestamp DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT d.*, 
             c.name as camera_nombre,
             i.nombre as interseccion_nombre,
             s.nombre as sensor_nombre
      FROM detections_log d
      LEFT JOIN cameras c ON d.camera_id = c.id
      LEFT JOIN intersecciones i ON d.interseccion_id = i.id
      LEFT JOIN sensores s ON d.sensor_id = s.id
      WHERE d.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByCamera(camera_id, limit = 100) {
    const query = `
      SELECT * FROM detections_log
      WHERE camera_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    const result = await db.query(query, [camera_id, limit]);
    return result.rows;
  }

  static async findByIntersection(interseccion_id, limit = 100) {
    const query = `
      SELECT * FROM detections_log
      WHERE interseccion_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `;
    const result = await db.query(query, [interseccion_id, limit]);
    return result.rows;
  }

  static async findByDateRange(startDate, endDate) {
    const query = `
      SELECT d.*, i.nombre as interseccion_nombre
      FROM detections_log d
      LEFT JOIN intersecciones i ON d.interseccion_id = i.id
      WHERE d.timestamp BETWEEN $1 AND $2
      ORDER BY d.timestamp DESC
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async getTodayStats(interseccion_id = null) {
    let query = `
      SELECT 
        COALESCE(SUM(personas), 0) as total_personas,
        COALESCE(SUM(carros), 0) as total_carros,
        COALESCE(SUM(motos), 0) as total_motos,
        COALESCE(SUM(buses), 0) as total_buses,
        COALESCE(SUM(camiones), 0) as total_camiones,
        COALESCE(SUM(total), 0) as total_vehiculos,
        COUNT(*) as total_registros
      FROM detections_log
      WHERE DATE(timestamp) = CURRENT_DATE
    `;
    
    const params = [];
    if (interseccion_id) {
      query += ` AND interseccion_id = $1`;
      params.push(interseccion_id);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async getHourlyStats(interseccion_id = null) {
    let query = `
      SELECT 
        TO_CHAR(timestamp, 'HH24:00') as hour,
        COALESCE(SUM(personas), 0) as personas,
        COALESCE(SUM(carros), 0) as carros,
        COALESCE(SUM(motos), 0) as motos,
        COALESCE(SUM(total), 0) as total
      FROM detections_log
      WHERE DATE(timestamp) = CURRENT_DATE
    `;
    
    const params = [];
    if (interseccion_id) {
      query += ` AND interseccion_id = $1`;
      params.push(interseccion_id);
    }
    
    query += ` GROUP BY hour ORDER BY hour`;
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async getSummary(interseccion_id = null) {
    let query = `
      SELECT 
        COALESCE(SUM(total), 0) as total_vehiculos,
        COALESCE(AVG(total), 0) as promedio_por_minuto,
        COALESCE(MAX(total), 0) as maximo_por_minuto,
        COUNT(*) as total_minutos
      FROM detections_log
      WHERE DATE(timestamp) = CURRENT_DATE
    `;
    
    const params = [];
    if (interseccion_id) {
      query += ` AND interseccion_id = $1`;
      params.push(interseccion_id);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM detections_log
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async deleteOld(days = 30) {
    const query = `
      DELETE FROM detections_log
      WHERE timestamp < CURRENT_DATE - INTERVAL '${days} days'
      RETURNING id
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Detection;