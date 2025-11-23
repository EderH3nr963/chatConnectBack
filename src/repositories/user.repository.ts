import { prisma } from "../config/prisma";

export class UserRepository {
  static async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, is_deleted: false },
    });
  }

  static async findByIdWithoutPassword(id: string) {
    return prisma.user.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, is_deleted: false },
    });
  }

  static async findByUsername(username: string) {
    return prisma.user.findFirst({
      where: { username, is_deleted: false },
    });
  }

  static async checkExisting(email: string, username: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        is_deleted: false,
      },
    });
  }

  static async create(data: {
    email: string;
    username: string;
    hash_password: string;
  }) {
    return prisma.user.create({ data });
  }

  static async updateById(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  static async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { is_deleted: true },
    });
  }
}
