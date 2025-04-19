// En memoria, almacenamos los códigos de verificación
const codeStore: { [email: string]: string } = {};

export const storeCode = (email: string, code: string) => {
  codeStore[email] = code;
  console.log(`Código almacenado para ${email}: ${code}`);
};

export const getCode = (email: string) => {
  return codeStore[email];
};

export const deleteCode = (email: string) => {
  delete codeStore[email];
  console.log(`Código eliminado para ${email}`);
};



