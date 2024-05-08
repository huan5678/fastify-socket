import { z } from 'zod';

// 創建用戶時的請求體驗證
const createUserSchema = z.object({
  name: z.string().min(1, '名稱請大於 1 個字').max(50, '名稱長度過長，最多只能 50 個字'),
  email: z.string().email('請填寫正確 email 格式'),
  password: z.string().min(6, '密碼長度需大於 6 個字')
});

// 查詢用戶時的 URL 參數驗證
const userParamsSchema = z.object({
  id: z.string().length(24, 'ID 格式無效')  // 假設 MongoDB 的 ObjectId 為 24 位
});

const userQueryStringsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10)
});
// 常用的回應結構
const userResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string()
  }).optional()
});

// 包裝成更大的 Schema，供外部引用
const Schemas = {
  createUser: {
    body: createUserSchema,
    response: userResponseSchema
  },
  userParams: userParamsSchema,
  userQueryStrings: userQueryStringsSchema
};

export { Schemas };