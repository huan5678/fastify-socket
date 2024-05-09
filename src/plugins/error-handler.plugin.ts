// src/plugins/error-handler-plugin.ts
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import Logger from '@/utils/logger';
import { CustomError } from '@/errors/custom-error';

// 使用 'fp' 創建插件，以支持封裝和異步註冊
export default fp(async (fastify: FastifyInstance) => {
    fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        // 如果錯誤是我們定義的CustomError，我們使用定義的狀態碼和訊息
        if (error instanceof CustomError) {
            Logger.error(error.toJSON());
            reply.status(error.statusCode).send(error.toJSON());
        } else {
            // 對於其他類型的錯誤，我們使用500狀態碼和通用訊息
            Logger.error(error);
            reply.status(500).send({ message: 'Something went wrong' });
        }
    });
});
