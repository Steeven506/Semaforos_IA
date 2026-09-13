const db = require('../config/database');

class GrupoSemaforo {
  static async create({ interseccion_id, nombre, descripcion, color_grupo, direccion }) {
    const query = `
      INSERT INTO grupos_semaforos 
      (interseccion_id, nombre, descripcion, color_grupo, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [interseccion_id, nombre, descripcion, color_grupo || 'azul', direccion || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT g.*, i.nombre as interseccion_nombre,
             (SELECT COUNT(*) FROM semaforos WHERE grupo_id = g.id) as total_semaforos,
             (SELECT COUNT(*) FROM cameras WHERE interseccion_id = g.interseccion_id) as total_camaras
      FROM grupos_semaforos g
      JOIN intersecciones i ON g.interseccion_id = i.id
      ORDER BY g.interseccion_id, g.nombre
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT g.*, i.nombre as interseccion_nombre
      FROM grupos_semaforos g
      JOIN intersecciones i ON g.interseccion_id = i.id
      WHERE g.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByIntersection(interseccion_id) {
    const query = `
      SELECT g.*,
             (SELECT COUNT(*) FROM semaforos WHERE grupo_id = g.id) as total_semaforos
      FROM grupos_semaforos g
      WHERE g.interseccion_id = $1
      ORDER BY g.nombre
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let counter = 1;

    const allowedFields = ['nombre', 'descripcion', 'color_grupo', 'direccion'];

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
      UPDATE grupos_semaforos
      SET ${fields.join(', ')}
      WHERE id = $${counter}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      DELETE FROM grupos_semaforos
      WHERE id = $1
      RETURNING id, nombre
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getSincronizacion(interseccion_id) {
    const query = `
      SELECT sg.*, 
             ga.nombre as grupo_a_nombre, 
             gb.nombre as grupo_b_nombre
      FROM sincronizacion_grupos sg
      JOIN grupos_semaforos ga ON sg.grupo_a_id = ga.id
      JOIN grupos_semaforos gb ON sg.grupo_b_id = gb.id
      WHERE sg.interseccion_id = $1
    `;
    const result = await db.query(query, [interseccion_id]);
    return result.rows;
  }

  static async createSincronizacion({ interseccion_id, grupo_a_id, grupo_b_id, offset_segundos, descripcion }) {
    const query = `
      INSERT INTO sincronizacion_grupos 
      (interseccion_id, grupo_a_id, grupo_b_id, offset_segundos, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [interseccion_id, grupo_a_id, grupo_b_id, offset_segundos || 0, descripcion];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async deleteSincronizacion(id) {
    const query = `
      DELETE FROM sincronizacion_grupos
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = GrupoSemaforo;