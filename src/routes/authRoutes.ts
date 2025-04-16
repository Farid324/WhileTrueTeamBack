import { Router } from 'express';
import { register } from '@/controllers/auth.controller'; // Solo importar register

const router = Router();

router.post('/register', register); // Solo ruta de registro

export default router;
