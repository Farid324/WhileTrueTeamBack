import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // 👈 Importar bcrypt

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { nombre_completo, email, contraseña, fecha_nacimiento, telefono } = req.body;

  try {
    if (!nombre_completo || !email || !contraseña || !fecha_nacimiento) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos." });
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado." });
    }

    // 🔒 ENCRIPTAR LA CONTRASEÑA AQUÍ
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // 🔥 GUARDAR LA CONTRASEÑA ENCRIPTADA
    const newUser = await prisma.usuario.create({
      data: {
        nombre_completo,
        email,
        contraseña: hashedPassword, // 👈 Aquí guardamos la contraseña encriptada
        fecha_nacimiento: new Date(fecha_nacimiento),
        telefono: telefono ? Number(telefono) : null,
        registrado_con: "email",
        verificado: false,
        host: false,
        driver: false,
      },
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente", user: { email: newUser.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
