const db = require('../config/database');

class Camera {
  static async create({ interseccion_id, sensor_id, grupo_id, name, url, camera_type, activo }) {
    const query = `
      INSERT INTO cameras 
      (interseccion_id, sensor_id, grupo_id, name, url, camera_type, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      interseccion_id || null,
      sensor_id || null,
      grupo_id || null,
      name,
      url,
      camera_type || 'webcam',
      activo !== undefined ? activo : true
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT c.*, 
             i.nombre as interseccion_nombre,
             g.nombre as grupo_nombre,
             g.color_grupo as grupo_color
      FROM cameras c
      LEFT JOIN intersecciones i ON c.interseccion_id = i.id
      LEFT JOIN grupos_semaforos g ON c.grupo_id = g.id
      ORDER BY c.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT c.*, 
             i.nombre as interseccion_nombre,
             g.nombre as grupo_nombre,
             g.color_grupo as grupo_color
      FROM cameras c
      LEFT JOIN intersecciones i ON c.interseccion_id = i.id
      LEFT JOIN grupos_semaforos g ON c.grupo_id = g.id
      WHERE c.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByIntersection(interseccion_id) {
    const query = `
      SELECT c.*, g.nombre as grupo_nombre
      FROM cameras c
      LEFT JOIN grupos_semaforos g ON c.grupo_id = g.id
      WHERE c.interseccion_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async findByGrupo(grupo_id) {
    const query = `
      SELECT * FROM cameras
      WHERE grupo_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [grupo_id]);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = [
      'name', 
      'url', 
      'camera_type', 
      'activo', 
      'interseccion_id', 
      'sensor_id', 
      'grupo_id'
    ];

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
      UPDATE cameras
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM cameras
      WHERE id = $1
      RETURNING id, name
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Camera;