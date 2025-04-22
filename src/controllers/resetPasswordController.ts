import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';

const prisma = new PrismaClient();
let userEmailBD = '';

export const getEmail= async (emailBD: string): Promise<any> => {
  userEmailBD = emailBD;
  console.log('Datos resetPasword:', emailBD);
}

export const resetPassword: RequestHandler = async (req, res) => {
  const { newPassword } = req.body;

  console.log('📩 Llega al backend:', { newPassword });

  if ( !newPassword) {
    res.status(400).json({ message: 'Faltan campos requeridos' });
    return;
  }

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: userEmailBD, 
        //codigoVerificacion: code.trim(),
      },
    });

    if (!foundUser) {
      
      console.log('El email no se encontró en la bd', userEmailBD);
      res.status(400).json({ message: 'Error del sistema' });
      return;
    }

    const user = foundUser;

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
