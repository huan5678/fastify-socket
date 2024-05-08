import { Types } from "mongoose";
import { FastifyReply } from "fastify";
import { UserUpdateBody } from "@/types";
import User from "@/models/user.model";
import { appError } from "@/utils/handle";

async function validateObjectId(id: string, reply: FastifyReply) {
  if (!Types.ObjectId.isValid(id)) {
    throw appError(reply, { code: 400, message: "Invalid ID format." });
  }
}

async function notFindUserError(id: string, reply: FastifyReply)
{
  const user = await User.findById(id);
  if (!user) {
    throw appError(reply, { code: 404, message: "User not found." });
  }
}

class UserService
{
  static async createAccount(data: { email: string; password: string; name: string }, replay: FastifyReply)
  {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw appError(replay, { code: 400, message: "User already exists." });
    }
    // 創建用戶
    const user = new User(data);
    await user.save();

    return user;
  }

  static async countMembers()
  {
    // 計算用戶數量
    const countMembers = await User.find().countDocuments();

    return countMembers;
  }
  static async getAllMembers(skip: number, limit: number)
  {
    // 查詢所有用戶
    const allMembers = await User.find().skip(skip).limit(limit);

    return allMembers;
  }
  static async getMemberById(id: string, reply: FastifyReply)
  {
    await validateObjectId(id, reply);
    await notFindUserError(id, reply);
    // 通過id查詢用戶
    const member = await User.findById(id);

    return member;
  }
  static async deleteMemberById(id: string, reply: FastifyReply)
  {
    await validateObjectId(id, reply);
    await notFindUserError(id, reply);
    // 通過id刪除用戶
    await User.findByIdAndDelete(id);

    return true;
  }
  static async updateMemberData(id: string, data: UserUpdateBody, reply: FastifyReply)
  {
    await validateObjectId(id, reply);
    await notFindUserError(id, reply);
    // 通過id更新用戶資料
    const member = await User.findByIdAndUpdate(id, data, { new: true });

    return member;
  }
}

export default UserService;