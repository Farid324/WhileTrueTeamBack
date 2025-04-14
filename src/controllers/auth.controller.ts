import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const allowedDomains = [
      '@gmail.com',
      '@outlook.com',
      '@hotmail.com',
      '@live.com',
      '@yahoo.com',
      '@icloud.com',
      '@proton.me'
    ];
    const emailDomain = email.substring(email.indexOf('@'));
    // Validar que email y password existan
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    // 🔥 Después validamos el dominio
    
    if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({ message: 'Introduzca un dominio correcto' });
    }

    // Validar la longitud de la contraseña
   if (password.length < 8 || password.length > 25) {
      return res.status(400).json({ message: 'La contraseña debe tener entre 8 y 25 caracteres' });
    }

    try {
      const user = await prisma.usuario.findUnique({
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