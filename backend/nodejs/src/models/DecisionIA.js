const db = require('../config/database');

class DecisionIA {
  static async create({ interseccion_id, grupo_id, accion, presion_calculada, tiempo_verde, algoritmo, justificacion }) {
    const query = `
      INSERT INTO decisiones_ia 
      (interseccion_id, grupo_id, accion, presion_calculada, tiempo_verde, algoritmo, justificacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [interseccion_id, grupo_id, accion, presion_calculada || 0, tiempo_verde, algoritmo, justificacion || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByInterseccion(interseccion_id, limit = 50) {
    const query = `
      SELECT d.*, g.nombre as grupo_nombre
      FROM decisiones_ia d
      LEFT JOIN grupos_semaforos g ON d.grupo_id = g.id
      WHERE d.interseccion_id = $1
      ORDER BY d.timestamp DESC
      LIMIT $2
    `;
    const result = await db.query(query, [interseccion_id, limit]);
    return result.rows;
  }

  static async findAll(limit = 100) {
    const query = `
      SELECT d.*, i.nombre as interseccion_nombre, g.nombre as grupo_nombre
      FROM decisiones_ia d
      JOIN intersecciones i ON d.interseccion_id = i.id
      LEFT JOIN grupos_semaforos g ON d.grupo_id = g.id
      ORDER BY d.timestamp DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async getEstadisticas(interseccion_id) {
    const query = `
      SELECT 
        algoritmo,
        COUNT(*) as total,
        AVG(tiempo_verde) as avg_verde,
        MIN(tiempo_verde) as min_verde,
        MAX(tiempo_verde) as max_verde
      FROM decisiones_ia
      WHERE interseccion_id = $1
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY algoritmo
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async getUltimaDecision(interseccion_id) {
    const query = `
      SELECT d.*, g.nombre as grupo_nombre
      FROM decisiones_ia d
      LEFT JOIN grupos_semaforos g ON d.grupo_id = g.id
      WHERE d.interseccion_id = $1
      ORDER BY d.timestamp DESC
      LIMIT 1
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows[0];
  }

  static async markAsApplied(id) {
    const query = `
      UPDATE decisiones_ia
      SET aplicada = TRUE
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = DecisionIA;