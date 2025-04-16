// Usaremos un objeto en memoria para almacenar los códigos por correo
const codeStore: { [email: string]: string } = {}; // Objeto que almacena códigos de verificación por email

// Función para almacenar el código de verificación para un correo específico
export const storeCode = (email: string, code: string) => {
  codeStore[email] = code;
  console.log(`Código almacenado para ${email}: ${code}`); // Log para verificar que se guarda correctamente
};

// Función para obtener el código almacenado para un correo específico
export const getCode = (email: string) => {
  return codeStore[email];
};

// Función para eliminar el código después de usarlo (opcional)
export const deleteCode = (email: string) => {
  delete codeStore[email];
};

