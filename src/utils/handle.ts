import { FastifyReply } from "fastify";

export function appError(replay: FastifyReply, { code, message }: { code: number; message: string }) {
    return replay.code(code).send({ status: false, message });
}

export function successHandle(replay: FastifyReply, message: string, data: unknown) {
    return replay.send({ status: true, message, data });
}