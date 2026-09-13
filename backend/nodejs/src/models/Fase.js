const db = require('../config/database');

class Fase {
  static async create({ semaforo_id, nombre, duracion, orden, color }) {
    const query = `
      INSERT INTO fases 
      (semaforo_id, nombre, duracion, orden, color)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [semaforo_id, nombre, duracion, orden, color || 'verde'];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT f.*, s.nombre as semaforo_nombre, s.tipo as semaforo_tipo
      FROM fases f
      JOIN semaforos s ON f.semaforo_id = s.id
      ORDER BY s.id, f.orden
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT f.*, s.nombre as semaforo_nombre, s.tipo as semaforo_tipo
      FROM fases f
      JOIN semaforos s ON f.semaforo_id = s.id
      WHERE f.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findBySemaforo(semaforo_id) {
    const query = `
      SELECT * FROM fases
      WHERE semaforo_id = $1
      ORDER BY orden
    `;
    const result = await db.query(query, [semaforo_id]);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = ['nombre', 'duracion', 'orden', 'color'];

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
      UPDATE fases
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM fases
      WHERE id = $1
      RETURNING id, nombre
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async deleteBySemaforo(semaforo_id) {
    const query = `
      DELETE FROM fases
      WHERE semaforo_id = $1
      RETURNING id
    `;
    const result = await db.query(query, [semaforo_id]);
    return result.rows;
  }
}

module.exports = Fase;