import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

// 創建用戶時的請求體驗證
const createUserSchema = z.object({
  name: z.string().min(1, '名稱請大於 1 個字').max(50, '名稱長度過長，最多只能 50 個字'),
  email: z.string().email('請填寫正確 email 格式'),
  password: z.string().min(6, '密碼長度需大於 6 個字')
}).describe('創建用戶時的請求體驗證');

// 查詢用戶時的 URL 參數驗證
const userParamsSchema = z.object({
  id: z.string().length(24, 'ID 格式無效')  // 假設 MongoDB 的 ObjectId 為 24 位
}).describe('查詢用戶時的 URL 參數 ID 驗證');

const userQueryStringsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10)
}).describe('查詢用戶時的 URL 查詢字串驗證');

// 創建用戶時的回應結構
const userCreateResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    token: z.string().optional(),
  }).optional()
}).describe('創建用戶時的回應結構');

const userResponseByIdSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
    gender: z.string().optional(),
    birthday: z.date().optional(),
    socialMedia: z.object({
      instagram: z.string().optional()
    }).optional()
  }).optional()
}).describe('查詢用戶時的回應結構');

// 常用的回應結構
const userResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    users: z.array(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      avatar: z.string().optional(),
      gender: z.string().optional(),
      birthday: z.date().optional(),
      socialMedia: z.object({
        facebook: z.string().optional(),
        instagram: z.string().optional()
      }).optional()
    })),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalCount: z.number(),
      totalPages: z.number()
    })
  }).optional()
}).describe('使用者查詢時的回應結構');

const userUpdateBodySchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email().optional(),
  gender: z.string().optional(),
  birthday: z.date().optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional()
  }).optional()
}).describe('更新用戶時的請求體驗證');

const notFindUserError = z.object({
  status: z.boolean(),
  message: z.string(),
}).describe('找不到用戶時的回應結構');


// 包裝成更大的 Schema，供外部引用
const Schemas = {
  createUser: {
    body: zodToJsonSchema(createUserSchema),
    response: zodToJsonSchema(userCreateResponseSchema)
  },
  userIdParams: zodToJsonSchema(userParamsSchema),
  getUserById: {
    response: zodToJsonSchema(userResponseByIdSchema)
  },
  userQueryStrings: zodToJsonSchema(userQueryStringsSchema),
  userResponse: zodToJsonSchema(userResponseSchema),
  userUpdateBody: zodToJsonSchema(userUpdateBodySchema),
  userResponseById: zodToJsonSchema(userResponseByIdSchema),
  notFindUserError: zodToJsonSchema(notFindUserError)
};

export { Schemas };