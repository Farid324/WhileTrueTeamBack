import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import { storeCode } from '@/utils/codeStore';  // Importamos la función para almacenar el código

const prisma = new PrismaClient();

// Configuración de Nodemailer usando Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'solizcespedesrodrigo1@gmail.com', // Tu correo personal de Gmail
    pass: 'ywkp ujdi qbuh bhlc', // Tu contraseña o contraseña de aplicación
  },
});

// Función de recuperación de contraseña
export const recoverPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'El correo no está registrado en Redibo' });
      return;
    }

    // Generar un código de verificación aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Almacenamos el código para este correo
    storeCode(email, verificationCode.toString());

    // Configuración del correo a enviar
    const mailOptions = {
      from: 'solizcespedesrodrigo1@gmail.com', // Tu correo personal
      to: email, // Correo del usuario al que se le enviará el código
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${verificationCode}`, // El código de verificación
    };

    // Enviar el correo con Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error al enviar el correo' });
      }

      console.log('Correo enviado:', info.response);
      res.json({ message: 'Correo de recuperación enviado', verificationCode });
    });

  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
