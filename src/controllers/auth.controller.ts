import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }
  
      if (user.contraseña !== password) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      return res.json({ message: 'Login exitoso', user: { email: user.email } });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  };