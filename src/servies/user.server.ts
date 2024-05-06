import User from "@/models/user";
import { IUser } from "@/types";

function notFindUserError(id: string)
{
  const user = User.findById(id);
  if (!user) {
    throw new Error('User not found.');
  }
}

class UserService {
  async countMembers()
  {
    // 計算用戶數量
    const countMembers = await User.find().countDocuments();

    return countMembers;
  }
  async getAllMembers(skip: number, limit: number)
  {
    // 查詢所有用戶
    const allMembers = await User.find().skip(skip).limit(limit);

    return allMembers;
  }
  async getMemberById(id: string)
  {
    notFindUserError(id);
    // 通過id查詢用戶
    const member = await User.findById(id);

    return member;
  }
  async deleteMemberById(id: string)
  {
    notFindUserError(id);
    // 通過id刪除用戶
    await User.findByIdAndDelete(id);

    return true;
  }
  async updateMemberData(id: string, data: IUser)
  {
    notFindUserError(id);
    // 通過id更新用戶資料
    const member = await User.findByIdAndUpdate(id, data, { new: true });

    return member;
  }
}

export default UserService;