const db = require('../config/database');

class Semaforo {
  static async create({ interseccion_id, nombre, tipo, estado, latitud, longitud }) {
    const query = `
      INSERT INTO semaforos 
      (interseccion_id, nombre, tipo, estado, latitud, longitud)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [interseccion_id, nombre, tipo, estado || 'activo', latitud, longitud];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT s.*, i.nombre as interseccion_nombre,
             (SELECT COUNT(*) FROM fases WHERE semaforo_id = s.id) as total_fases
      FROM semaforos s
      JOIN intersecciones i ON s.interseccion_id = i.id
      ORDER BY s.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, i.nombre as interseccion_nombre
      FROM semaforos s
      JOIN intersecciones i ON s.interseccion_id = i.id
      WHERE s.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByIntersection(interseccion_id) {
    const query = `
      SELECT s.*,
             (SELECT COUNT(*) FROM fases WHERE semaforo_id = s.id) as total_fases
      FROM semaforos s
      WHERE s.interseccion_id = $1
      ORDER BY s.created_at DESC
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = ['nombre', 'tipo', 'estado', 'latitud', 'longitud'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${counter}`);
        values.push(data[field]);
        counter++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    values.push(id);
    const query = `
      UPDATE semaforos
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM semaforos
      WHERE id = $1
      RETURNING id, nombre
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Semaforo;