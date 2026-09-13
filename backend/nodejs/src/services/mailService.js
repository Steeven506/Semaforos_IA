const nodemailer = require('nodemailer');
require('dotenv').config();

class MailService {
  static createTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  static async sendVerificationEmail(email, token, nombre) {
    const transporter = this.createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Verifica tu cuenta - Traffic System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3a5c;">Bienvenido a Traffic System</h2>
          <p>Hola ${nombre},</p>
          <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #4aa56f; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Verificar mi cuenta
          </a>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="color: #666; font-size: 12px;">${verificationUrl}</p>
          <p>Este enlace expira en 24 horas.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Traffic Intelligence System</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(email, token, nombre) {
    const transporter = this.createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Recuperacion de contrasena - Traffic System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3a5c;">Recuperacion de contrasena</h2>
          <p>Hola ${nombre},</p>
          <p>Recibimos una solicitud para restablecer tu contrasena. Haz clic en el siguiente enlace:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #4aa56f; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Restablecer contrasena
          </a>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="color: #666; font-size: 12px;">${resetUrl}</p>
          <p>Este enlace expira en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Traffic Intelligence System</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = MailService;