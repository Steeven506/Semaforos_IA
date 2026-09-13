const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role_nombre || user.role_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
  }

  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya esta registrado');
    }

    const user = await User.create(userData);
    const verificationToken = this.generateVerificationToken();
    
    await User.updateVerificationToken(user.email, verificationToken);
    
    return {
      user,
      verificationToken
    };
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales invalidas');
    }

    if (!user.activo) {
      throw new Error('Usuario desactivado');
    }

    if (!user.verificado) {
      throw new Error('Usuario no verificado. Revisa tu correo');
    }

    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales invalidas');
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role_id: user.role_id
      },
      token,
      refreshToken
    };
  }

  static async verifyEmail(token) {
    const user = await User.verifyUser(token);
    if (!user) {
      throw new Error('Token invalido o expirado');
    }
    return user;
  }

  static async requestPasswordReset(email) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const resetToken = this.generateVerificationToken();
    const expiration = new Date(Date.now() + 3600000);

    await User.updateRecoveryToken(email, resetToken, expiration);

    return {
      user,
      resetToken
    };
  }

  static async resetPassword(token, newPassword) {
    const user = await User.updatePassword(token, newPassword);
    if (!user) {
      throw new Error('Token invalido o expirado');
    }
    return user;
  }
}

module.exports = AuthService;