import { RequestHandler } from 'express';
import { getCode } from '@/utils/codeStore';

export const verifyCode: RequestHandler = (req, res) => {
  const { email, code } = req.body;

  const savedCode = getCode(email);
  if (!savedCode || savedCode !== code) {
    res.status(400).json({ message: 'Código incorrecto' });
    return;
  }

  res.json({ message: 'Código verificado correctamente' });
};
