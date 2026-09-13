const jwt = require('jsonwebtoken');
require('dotenv').config();

const ROLE_MAP = {
  1: 'admin',
  2: 'operador',
  3: 'visualizador'
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalido o expirado' });
    }
    
    if (ROLE_MAP[user.role]) {
      user.role = ROLE_MAP[user.role];
    }
    
    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para esta accion',
        required_roles: roles,
        your_role: req.user.role
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};