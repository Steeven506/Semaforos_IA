const bcrypt = require('bcryptjs');

const password = 'admin123';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Contraseña original:', password);
console.log('Hash generado:', hashedPassword);