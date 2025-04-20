import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { resetAttempts } from '../utils/attemptStore';

const prisma = new PrismaClient();

export const verifyCode = async (req: Request, res: Response) => {
  const { code } = req.body;

  console.log('🧪 Código recibido:', code);

  if (!code || code.trim().length !== 6) {
    res.status(400).json({ message: 'Código inválido' });
    return;
  }
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        codigoVerificacion: code.trim(),
      },
    });

    if (!user) {
      res.status(400).json({ message: 'Código incorrecto' });
      return;
    }

    resetAttempts(user.email);

    res.json({ message: 'Código verificado correctamente', code: code.trim() });

  } catch (error) {
    console.error('❌ Error al verificar el código:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
