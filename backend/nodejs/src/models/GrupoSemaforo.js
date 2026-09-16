const db = require('../config/database');

class GrupoSemaforo {
  static async create({ interseccion_id, nombre, descripcion, color_grupo, direccion, tiempo_verde, tiempo_amarillo, tiempo_rojo, offset_segundos }) {
    const query = `
      INSERT INTO grupos_semaforos 
      (interseccion_id, nombre, descripcion, color_grupo, direccion, tiempo_verde, tiempo_amarillo, tiempo_rojo, offset_segundos)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      interseccion_id,
      nombre,
      descripcion || null,
      color_grupo || 'azul',
      direccion || null,
      tiempo_verde || 30,
      tiempo_amarillo || 5,
      tiempo_rojo || 25,
      offset_segundos || 0
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT g.*, i.nombre as interseccion_nombre,
             (SELECT COUNT(*) FROM semaforos WHERE grupo_id = g.id) as total_semaforos,
             (SELECT COUNT(*) FROM cameras WHERE grupo_id = g.id) as total_camaras
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

    const allowedFields = [
      'nombre',
      'descripcion',
      'color_grupo',
      'direccion',
      'tiempo_verde',
      'tiempo_amarillo',
      'tiempo_rojo',
      'estado_actual',
      'modo_automatico',
      'offset_segundos'
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

  static async cambiarEstado(id, estado) {
    const query = `
      UPDATE grupos_semaforos
      SET estado_actual = $1, modo_automatico = FALSE
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [estado, id]);
    return result.rows[0];
  }

  static async activarModoAutomatico(id) {
    const query = `
      UPDATE grupos_semaforos
      SET modo_automatico = TRUE
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = GrupoSemaforo;