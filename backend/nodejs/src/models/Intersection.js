const db = require('../config/database');

class Intersection {
  static async create({ usuario_id, nombre, descripcion, latitud, longitud, direccion, ciudad, pais }) {
    const query = `
      INSERT INTO intersecciones 
      (usuario_id, nombre, descripcion, latitud, longitud, direccion, ciudad, pais)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [usuario_id, nombre, descripcion, latitud, longitud, direccion, ciudad, pais];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email,
             (SELECT COUNT(*) FROM semaforos WHERE interseccion_id = i.id) as total_semaforos,
             (SELECT COUNT(*) FROM sensores WHERE interseccion_id = i.id) as total_sensores,
             (SELECT COUNT(*) FROM cameras WHERE interseccion_id = i.id) as total_camaras
      FROM intersecciones i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.activo = TRUE
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT i.*, u.nombre as usuario_nombre, u.email as usuario_email
      FROM intersecciones i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByUser(usuario_id) {
    const query = `
      SELECT * FROM intersecciones
      WHERE usuario_id = $1 AND activo = TRUE
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [usuario_id]);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = ['nombre', 'descripcion', 'latitud', 'longitud', 'direccion', 'ciudad', 'pais', 'activo'];

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
      UPDATE intersecciones
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE intersecciones
      SET activo = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, nombre
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getStats(id) {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM semaforos WHERE interseccion_id = $1) as total_semaforos,
        (SELECT COUNT(*) FROM sensores WHERE interseccion_id = $1) as total_sensores,
        (SELECT COUNT(*) FROM cameras WHERE interseccion_id = $1) as total_camaras,
        (SELECT COUNT(*) FROM emergencias WHERE interseccion_id = $1 AND estado = 'activa') as emergencias_activas,
        (SELECT COALESCE(SUM(total), 0) FROM detections_log WHERE interseccion_id = $1 AND DATE(timestamp) = CURRENT_DATE) as total_detecciones_hoy
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Intersection;