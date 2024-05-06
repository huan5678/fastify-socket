import { FastifyReply, FastifyRequest } from "fastify";

class MemberController {
  public static getAllMembers = async (req: FastifyRequest, replay: FastifyReply) =>
  {
    // 從查詢參數中獲取頁碼和限制數量，並確保它們是數字類型
    const page = parseInt(req.query.page, 10) || 1; // 預設為第1頁
    const limit = parseInt(req.query.limit, 10) || 10; // 預設限制為10

    // 獲取總用戶數，用於計算總頁數
    const totalCount = await MemberService.countMembers();
    const skip = (page - 1) * limit;

    // 添加skip和limit進行分頁
    const users = await MemberService.getAllMembers(skip, limit);
    // 計算總頁數
    const totalPages = Math.ceil(totalCount / limit);

    // 使用分頁後的結果回應
    return replay.send({
      result: users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
  };

  public static getMemberById: RequestHandler = async (req, replay, next) => {
    const { id } = req.params;
    if (!id) {
      throw appError({ code: 400, message: "請提供使用者 id", next });
    }
    const user = await MemberService.getMemberById(id);

    return successHandle(replay, "成功取的使用者資訊", { replayult: user });
  };

  public static deleteMemberById: RequestHandler = async (req, replay, next) =>
  {
    const { id } = req.params;
    await AuthService.deleteMemberById(id, next);
    return successHandle(replay, "成功刪除使用者", { replayult: null });
  };

  public static updateProfile: RequestHandler = async (req: any, replay, next) => {
    const { user } = req;
    const validFields = ["name", "avatar", "gender", "socialMedia" , "birthday"];
    const updateData = {};
    for (const field of validFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (updateData["avatar"] && !validator.isURL(updateData["avatar"])) {
      throw appError({ code: 400, message: "請確認照片是否傳入網址", next });
    }
    const userData = await MemberService.updateMemberData(user.id, updateData);
    return successHandle(replay, "成功更新使用者資訊！", { replayult: userData });
  };

}

export default MemberController;
