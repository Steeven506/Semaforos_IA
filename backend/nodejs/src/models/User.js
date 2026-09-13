const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ role_id, email, password, nombre, apellido, telefono }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO usuarios (role_id, email, password, nombre, apellido, telefono)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, role_id, email, nombre, apellido, telefono, verificado, created_at
    `;
    
    const values = [role_id, email, hashedPassword, nombre, apellido, telefono];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT u.id, u.role_id, u.email, u.nombre, u.apellido, u.telefono, 
             u.verificado, u.activo, u.created_at, r.nombre as role_nombre
      FROM usuarios u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateVerificationToken(email, token) {
    const query = `
      UPDATE usuarios 
      SET token_verificacion = $1, updated_at = CURRENT_TIMESTAMP
      WHERE email = $2
      RETURNING id, email
    `;
    const result = await db.query(query, [token, email]);
    return result.rows[0];
  }

  static async verifyUser(token) {
    const query = `
      UPDATE usuarios 
      SET verificado = TRUE, token_verificacion = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE token_verificacion = $1
      RETURNING id, email, nombre
    `;
    const result = await db.query(query, [token]);
    return result.rows[0];
  }

  static async updateRecoveryToken(email, token, expiration) {
    const query = `
      UPDATE usuarios 
      SET token_recuperacion = $1, token_expiracion = $2, updated_at = CURRENT_TIMESTAMP
      WHERE email = $3
      RETURNING id, email
    `;
    const result = await db.query(query, [token, expiration, email]);
    return result.rows[0];
  }

  static async updatePassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = `
      UPDATE usuarios 
      SET password = $1, token_recuperacion = NULL, token_expiracion = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE token_recuperacion = $2 AND token_expiracion > CURRENT_TIMESTAMP
      RETURNING id, email
    `;
    const result = await db.query(query, [hashedPassword, token]);
    return result.rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;