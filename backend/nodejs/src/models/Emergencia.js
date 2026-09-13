const db = require('../config/database');

class Emergencia {
  static async create({ interseccion_id, tipo, descripcion, estado }) {
    const query = `
      INSERT INTO emergencias 
      (interseccion_id, tipo, descripcion, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [interseccion_id, tipo, descripcion, estado || 'activa'];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT e.*, i.nombre as interseccion_nombre, i.ciudad as interseccion_ciudad
      FROM emergencias e
      JOIN intersecciones i ON e.interseccion_id = i.id
      ORDER BY e.timestamp DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT e.*, i.nombre as interseccion_nombre, i.ciudad as interseccion_ciudad
      FROM emergencias e
      JOIN intersecciones i ON e.interseccion_id = i.id
      WHERE e.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByIntersection(interseccion_id) {
    const query = `
      SELECT * FROM emergencias
      WHERE interseccion_id = $1
      ORDER BY timestamp DESC
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async findActivas() {
    const query = `
      SELECT e.*, i.nombre as interseccion_nombre
      FROM emergencias e
      JOIN intersecciones i ON e.interseccion_id = i.id
      WHERE e.estado = 'activa'
      ORDER BY e.timestamp DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = ['tipo', 'descripcion', 'estado'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${counter}`);
        values.push(data[field]);
        counter++;
      }
    }

    if (data.estado === 'resuelta') {
      fields.push(`resuelto_at = CURRENT_TIMESTAMP`);
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    values.push(id);
    const query = `
      UPDATE emergencias
      SET ${fields.join(', ')}
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM emergencias
      WHERE id = $1
      RETURNING id, tipo
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Emergencia;