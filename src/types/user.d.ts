export interface User {
  id: string;
  username: string;
  email: string;
  hashPassword: string;
}

export type UserWithoutPassword = Omit<User, "hashPassword">;
