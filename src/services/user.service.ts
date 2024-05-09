import { FastifyReply } from "fastify";
import { UserUpdateBody } from "@/types";
import { appError } from "@/utils/handle";
import { generateToken } from "@/utils/auth";
import prisma from "@/utils/prismaClient";

const User = prisma.user;

async function findUser(id: string, reply: FastifyReply) {
  const user = await User.findUnique({ where: { id } });
  if (!user) {
    throw appError(reply, { code: 404, message: "User not found." });
  }
  return user;
}

class UserService {
  static async createAccount(data: { email: string; password: string; name: string }, reply: FastifyReply) {
    const existingUser = await User.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw appError(reply, { code: 400, message: "User already exists." });
    }
    const user = await User.create({ data });
    const token = generateToken({ userId: user.id, role: user.role });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }

  static async countMembers() {
    return await User.count();
  }

  static async getAllMembers(skip: number, limit: number) {
    return await User.findMany({
      skip,
      take: limit,
    });
  }

  static async getMemberById(id: string, reply: FastifyReply) {
    return await findUser(id, reply);
  }

  static async deleteMemberById(id: string, reply: FastifyReply) {
    await findUser(id, reply);
    await User.delete({ where: { id } });
    return true;
  }

  static async updateMemberData(id: string, data: UserUpdateBody, reply: FastifyReply) {
    await findUser(id, reply);
    return await User.update({
      where: { id },
      data,
    });
  }
}

export default UserService;
