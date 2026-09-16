const db = require('../config/database');

class ControlSemaforo {
  static async create({ semaforo_id, grupo_id, interseccion_id, estado, origen, usuario_id, duracion }) {
    const query = `
      INSERT INTO control_semaforos 
      (semaforo_id, grupo_id, interseccion_id, estado, origen, usuario_id, duracion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [semaforo_id, grupo_id, interseccion_id, estado, origen || 'manual', usuario_id, duracion || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByInterseccion(interseccion_id, limit = 50) {
    const query = `
      SELECT c.*, s.nombre as semaforo_nombre, u.nombre as usuario_nombre
      FROM control_semaforos c
      JOIN semaforos s ON c.semaforo_id = s.id
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.interseccion_id = $1
      ORDER BY c.timestamp DESC
      LIMIT $2
    `;
    const result = await db.query(query, [interseccion_id, limit]);
    return result.rows;
  }

  static async getUltimoControl(semaforo_id) {
    const query = `
      SELECT * FROM control_semaforos
      WHERE semaforo_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const result = await db.query(query, [semaforo_id]);
    return result.rows[0];
  }
}

module.exports = ControlSemaforo;