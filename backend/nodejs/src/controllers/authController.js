const AuthService = require('../services/authService');
const MailService = require('../services/mailService');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, nombre, apellido, telefono, role_id } = req.body;

      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Email, password y nombre son requeridos' });
      }

      const result = await AuthService.register({
        role_id: role_id || 3,
        email,
        password,
        nombre,
        apellido,
        telefono
      });

      try {
        await MailService.sendVerificationEmail(email, result.verificationToken, nombre);
      } catch (mailError) {
        console.error('Error enviando correo:', mailError);
      }

      res.status(201).json({
        message: 'Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.',
        user: result.user
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son requeridos' });
      }

      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Token requerido' });
      }

      const user = await AuthService.verifyEmail(token);
      res.json({
        message: 'Cuenta verificada exitosamente',
        user
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email requerido' });
      }

      const result = await AuthService.requestPasswordReset(email);

      try {
        await MailService.sendPasswordResetEmail(email, result.resetToken, result.user.nombre);
      } catch (mailError) {
        console.error('Error enviando correo:', mailError);
      }

      res.json({
        message: 'Si el correo existe, recibiras un enlace para restablecer tu contrasena'
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token y nueva contrasena son requeridos' });
      }

      const user = await AuthService.resetPassword(token, newPassword);
      res.json({
        message: 'Contrasena actualizada exitosamente',
        user
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;