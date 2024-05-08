import { FastifyReply, FastifyRequest } from "fastify";
import validator from "validator";
import { UserService } from "@/services";
import { appError, successHandle } from "@/utils/handle";
import { IUser, UserUpdateBody } from "@/types";

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

  public static getMemberById = async (req: FastifyRequest & { params: { id: string } }, replay: FastifyReply) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      throw appError(replay,{ code: 400, message: "請提供使用者 id" });
    }
    const user = await UserService.getMemberById(id, replay);

    return successHandle(replay, {
      message: "成功取的使用者資訊",
      data: { user }
    });
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

    if (updateData["avatar"] && !validator.isURL(updateData["avatar"] as string)) {
      throw appError(replay, { code: 400, message: "請確認照片是否傳入網址" });
    }
    const userResult = await UserService.updateMemberData(user.id, updateData, replay);
    return successHandle(replay, {
      message: "成功更新使用者資訊！",
      data: { user: userResult }
    });
  };

  public static createAccount = async (req: FastifyRequest, replay: FastifyReply) =>
  {
    const { email, password, name } = req.body as { email: string; password: string; name: string };
    if (!email || !password || !name) {
      throw appError(replay, { code: 400, message: "Please provide email, password, name" });
    }
    const user = await UserService.createAccount({ email, password, name }, replay);
    return successHandle(replay, {
      message: "成功建立帳號！",
      data: { user }
    });
  };
}

export default UserController;
