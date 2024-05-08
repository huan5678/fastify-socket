import { FastifyRequest, FastifyReply } from "fastify";
import Logger from "@/utils/logger";
import app from "@/app/app.fastify";
import { Server, Socket } from "socket.io";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

const startServer = async () => {
  const port = process.env.PORT || "3000";
  const startTime = Date.now();
  try {
    app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
      const healthCheck = {
        status: true,
        message: "OK",
        uptime: process.uptime(),
        timestamp: new Date(startTime).toLocaleString(),
        host: request.headers.host,
      };
      reply.send(healthCheck);
    });

    await app.ready();
    app.io.on("connection", (socket: Socket) => {
      Logger.info(`New connection: ${socket.id}`);
      socket.on("disconnect", () => {
        Logger.info(`Connection closed: ${socket.id}`);
      });
    });

    await app.listen({
      port: parseInt(port),
    });

    const endTime = Date.now();
    const startupTime = (endTime - startTime) / 1000;
    Logger.info(`Server started in ${startupTime} seconds`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

export { startServer };
