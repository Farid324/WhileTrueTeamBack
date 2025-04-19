import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const resetPassword: RequestHandler = async (req, res) => {
  const { code, newPassword } = req.body;

  console.log('📩 Llega al backend:', { code, newPassword });

  if (!code || !newPassword) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        codigoVerificacion: code.trim(),
      },
    });

    if (users.length === 0) {
      console.log('❌ No se encontró ningún usuario con ese código.');
      console.log('📋 Buscando código en la BD:', code);
      const all = await prisma.user.findMany({
        select: { email: true, codigoVerificacion: true },
      });
      console.log('🧾 Todos los usuarios y códigos:', all);
      res.status(400).json({ message: 'Código inválido' });
      return;
    }

    const user = users[0];

    await prisma.user.update({
      where: { email: user.email },
      data: {
        contraseña: newPassword,
        // NO borramos el código
      },
    });

    console.log('✅ Contraseña actualizada para:', user.email);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error en resetPassword:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
