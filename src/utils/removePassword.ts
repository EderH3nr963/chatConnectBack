export function removePassword<T extends { hash_password?: string }>(user: T) {
  const { hash_password: _, ...safeUser } = user;
  return safeUser;
}
