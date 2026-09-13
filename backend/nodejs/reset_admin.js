const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function resetAdmin() {
  const email = 'admin@traffic.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Hash generado:', hashedPassword);

  try {
    const result = await db.query(
      `UPDATE usuarios 
       SET password = $1, verificado = TRUE, activo = TRUE
       WHERE email = $2
       RETURNING id, email, nombre, verificado`,
      [hashedPassword, email]
    );
    
    if (result.rows.length > 0) {
      console.log('Admin actualizado correctamente:');
      console.log(result.rows[0]);
    } else {
      console.log('No se encontro el usuario con email:', email);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

resetAdmin();