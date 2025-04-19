// En memoria, almacenamos los intentos fallidos y el tiempo de bloqueo
const attemptStore: { [email: string]: { attempts: number, lockTime: number } } = {};

const MAX_ATTEMPTS = 5; // Máximo número de intentos permitidos
const LOCK_TIME = 60 * 60 * 1000; // Bloqueo de 1 hora en milisegundos

export const recordAttempt = (email: string) => {
  const now = Date.now();

  // Si el usuario no tiene intentos registrados, inicializamos sus datos
  if (!attemptStore[email]) {
    attemptStore[email] = { attempts: 0, lockTime: 0 };
  }

  // Si el usuario está bloqueado, comprobar si ya pasó una hora
  if (attemptStore[email].lockTime > now) {
    const remainingTime = attemptStore[email].lockTime - now; // Tiempo restante de bloqueo
    return { isLocked: true, remainingTime }; // Devolvemos el tiempo restante en milisegundos
  }

  // Si no está bloqueado, incrementamos los intentos fallidos
  attemptStore[email].attempts += 1;

  // Si el número de intentos supera el máximo, bloqueamos al usuario
  if (attemptStore[email].attempts >= MAX_ATTEMPTS) {
    attemptStore[email].lockTime = now + LOCK_TIME; // Establecemos el tiempo de bloqueo por 1 hora
    attemptStore[email].attempts = 0; // Resetear los intentos fallidos
    return { isLocked: true, remainingTime: LOCK_TIME }; // Bloqueo por una hora
  }

  // Si no está bloqueado y no ha superado los intentos, no bloqueamos
  return { isLocked: false };
};

export const resetAttempts = (email: string) => {
  delete attemptStore[email]; // Restablecer los intentos para un usuario
};
