import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserService } from "@/services";
import { appError, successHandle } from "@/utils/handle";
import { IUser, UserUpdateBody } from "@/types";
import { passwordCheck } from "@/utils/auth";

class UserController {
  public static getAllMembers = async (req: FastifyRequest<{ Querystring: { page: string; limit: string } }>, replay: FastifyReply) =>
  {
    // 從查詢參數中獲取頁碼和限制數量，並確保它們是數字類型
    const page = parseInt(req.query.page, 10) || 1; // 預設為第1頁
    const limit = parseInt(req.query.limit, 10) || 10; // 預設限制為10

    // 獲取總用戶數，用於計算總頁數
    const totalCount = await UserService.countMembers();
    const skip = (page - 1) * limit;

    // 添加skip和limit進行分頁
    const users = await UserService.getAllMembers(skip, limit);
    // 計算總頁數
    const totalPages = Math.ceil(totalCount / limit);

    // 使用分頁後的結果回應
    return successHandle(replay, {
      message: "成功取得所有使用者資訊",
      data: {
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      }
    });
  };

  public static getMemberById = async (req: FastifyRequest<{ Params: { id: string } }>, replay: FastifyReply) =>
  {
    try {
    const { id } = req.params;
    console.log("Request for user ID:", id);
    if (!id) {
      throw appError(replay,{ code: 400, message: "Invalid ID" });
    }
    const data = await UserService.getMemberById(id, replay);

    return data && successHandle(replay, {
      message: "成功取的使用者資訊",
      data,
    });
    } catch (error) {
      throw appError(replay, { code: 500, message: "Internal Server Error" });
    }
  };

  public static deleteMemberById = async (req: FastifyRequest & { params: { id: string } }, replay: FastifyReply) =>
  {
    const { id } = req.params;
    await UserService.deleteMemberById(id, replay);
    return successHandle(replay,
      {
        message: "成功刪除使用者",
        data: null,
      });
  };

  public static updateMemberData = async (req: FastifyRequest & { user: IUser }, replay: FastifyReply) => {
    const { user } = req;
    const validFields = ["name", "avatar", "gender", "socialMedia" , "birthday"];
    const updateData: UserUpdateBody = {
    };
    const body = req.body as UserUpdateBody;
    for (const field of validFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (updateData["avatar"] && !z.string().url().safeParse(updateData["avatar"]).success) {
      throw appError(replay, { code: 400, message: "Please provide a valid URL for the avatar" });
    }
    const data = await UserService.updateMemberData(user.id, updateData, replay);
    return successHandle(replay, {
      message: "成功更新使用者資訊！",
      data,
    });
  };

  public static createAccount = async (req: FastifyRequest, replay: FastifyReply) =>
  {
    const { email, password, name } = req.body as { email: string; password: string; name: string };
    if (!email || !password || !name) {
      throw appError(replay, { code: 400, message: "Please provide email, password, name" });
    }
    if (!z.string().email().safeParse(email).success) {
      throw appError(replay, { code: 400, message: "Please provide a valid email" });
    }
    if (!passwordCheck(password)) {
      throw appError(replay, { code: 400, message: "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character" });
    }
    const data = await UserService.createAccount({ email, password, name }, replay);
    return successHandle(replay, {
      message: "成功建立帳號！",
      data,
    });
  };
}

export default UserController;
