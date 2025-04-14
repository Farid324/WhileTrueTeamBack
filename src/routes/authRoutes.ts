import express, { Request, Response, Router } from "express"; // <-- Importa Router también
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router: Router = express.Router(); // <-- AQUI TIPAMOS EXPLÍCITAMENTE
const prisma = new PrismaClient();

router.post("/register", async (req: Request, res: Response) => {
    try {
      const { nombre_completo, email, contraseña, fecha_nacimiento, telefono } = req.body;
  
      if (!nombre_completo || !email || !contraseña || !fecha_nacimiento) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos." });
      }
  
      const existingUser = await prisma.usuario.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "El correo electrónico ya está registrado." });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contraseña, salt);
  
      const newUser = await prisma.usuario.create({
        data: {
          nombre_completo,
          email,
          contraseña: hashedPassword,
          fecha_nacimiento: new Date(fecha_nacimiento),
          telefono: telefono ? Number(telefono) : null,
          registrado_con: "email",
          verificado: false,
          host: false,
          driver: false,
        },
      });
  
      res.status(201).json({ message: "Usuario registrado exitosamente.", userId: newUser.id_usuario });
    } catch (error) {
      console.error("Error en /register:", error);
      res.status(500).json({ message: "Error en el servidor al registrar el usuario." });
    }
  });
  

export default router;
