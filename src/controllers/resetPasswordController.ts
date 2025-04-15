import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import { deleteCode } from '@/utils/codeStore';

const prisma = new PrismaClient();

export const resetPassword: RequestHandler = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    await prisma.user.update({
      where: { email },
      data: { contraseña: newPassword },
    });

    deleteCode(email); // Limpieza del código temporal

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};
