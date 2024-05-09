// utils/prismaClient.ts
import { PrismaClient } from '@prisma/client';
import Logger from '@/utils/logger';

const prisma = new PrismaClient();

prisma.$connect().then(() => {
    Logger.info('資料庫連線成功');
}).catch(error => {
    Logger.warn(`資料庫連線錯誤: ${error.message}`);
});

export default prisma;
