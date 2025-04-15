// src/utils/codeStore.ts
const codeMap = new Map<string, string>();

export function saveCode(email: string, code: string) {
  codeMap.set(email, code);
}

export function getCode(email: string) {
  return codeMap.get(email);
}

export function deleteCode(email: string) {
  codeMap.delete(email);
}
