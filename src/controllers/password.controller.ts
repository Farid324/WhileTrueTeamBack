// password.controller.ts
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'solizcespedesrodrigo1@gmail.com',
    pass: 'ywkp ujdi qbuh bhlc',
  },
  tls: {
    rejectUnauthorized: false, // Esto ignora el error del certificado autofirmado
  }
});


export const recoverPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'El correo no está registrado en Redibo' });
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: { codigoVerificacion: verificationCode },
    });
    // Consulta para obtener el código de verificación desde la base de datos
    const updatedUser = await prisma.user.findUnique({
      where: { email },
      select: { codigoVerificacion: true }, // Solo obtenemos el código de verificación
    });

    // Mostramos el código de verificación en la consola
    console.log('✅ Código de verificación actualizado:', updatedUser?.codigoVerificacion);

    await transporter.sendMail({
      from: 'solizcespedesrodrigo1@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu código de recuperación es: ${verificationCode}`,
    });
    res.json({ message: 'Correo de recuperación enviado', verificationCode });
    return;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
