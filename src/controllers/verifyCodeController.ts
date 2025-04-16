import { getCode, deleteCode } from '@/utils/codeStore';  // Asegúrate de importar las funciones correctas
import { RequestHandler } from 'express';

export const verifyCode: RequestHandler = (req, res) => {
  const { email, code } = req.body;

  // Recuperamos el código almacenado para el correo
  const savedCode = getCode(email);

  // Asegúrate de que el código proporcionado sea una cadena y comparar con el almacenado
  console.log(`Código almacenado: ${savedCode}`); // Log para verificar el código almacenado
  console.log(`Código proporcionado: ${code}`);  // Log para verificar el código proporcionado

  if (!savedCode) {
    res.status(400).json({ message: 'No se encontró un código de verificación para este correo' });
    return;
  }

  // Comparar el código almacenado con el proporcionado
  if (savedCode !== code) {
    res.status(400).json({ message: 'Código incorrecto' });
    return;
  }

  // El código es correcto, podemos proceder a borrar el código para evitar futuros usos
  deleteCode(email);

  res.json({ message: 'Código verificado correctamente' });
};
