import { FastifyReply } from "fastify";
import Logger from "@/utils/logger";

export function appError(replay: FastifyReply, { code, message }: { code: number; message: string })
{
    Logger.error(`Error ${code}: ${message}`);
    replay.code(code).send({ status: false, message });
}

export function successHandle(reply: FastifyReply, {code = 200, message, data}: {code?: number, message: string, data: unknown})
{
  reply.code(code).send({ status: true, message, data });
}