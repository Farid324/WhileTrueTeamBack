import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // <== IMPORTACIÓN AÑADIDA

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// End point para verificar la salud de la conexión de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 👇 Aquí montas tus rutas
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});