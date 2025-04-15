import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express'; // <- usa RequestHandler

const prisma = new PrismaClient();

export const recoverPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Correo de recuperación enviado (simulado)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
