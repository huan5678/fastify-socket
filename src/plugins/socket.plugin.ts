import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyIO from "fastify-socket.io";

import { Server, Socket } from "socket.io";
import Logger from "@/utils/logger";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
    notifyUsers: (event: string, data: unknown) => void;
  }
}

export default fp(async (fastify: FastifyInstance) =>
{
  fastify.register(fastifyIO,{
    // socket.io options
    cors: {
      origin: "*",  // 配置CORS以跨域的需要
      methods: ["GET", "POST"]
    }
  });

  fastify.ready().then(() => {
    fastify.io.on("connection", (socket: Socket) => {
        Logger.info(`New connection: ${socket.id}`);
        socket.on("disconnect", () => {
          Logger.info(`Connection closed: ${socket.id}`);
        });
    });
    Logger.info("Socket.io is ready");
  });

  fastify.decorate('notifyUsers', (event: string, data: unknown) =>
  {
    Logger.info(`Notifying users about ${event} event with data: ${JSON.stringify(data)}`);
    fastify.io.emit(event, data);
  });
});