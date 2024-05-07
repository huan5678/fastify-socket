import path from "path";
import { FastifyRequest, FastifyReply } from "fastify";
import AutoLoad from "@fastify/autoload";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import Logger from "@/utils/logger";
import app from "./app.fastify";
import { afterRegisterRoutes } from "./app.swagger";
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

    await afterRegisterRoutes(app);

    app.register(fastifyIO);

    app.register(AutoLoad, {
      dir: path.join(__dirname, "..", "plugins"),
      options: Object.assign({}),
    });

    app.register(AutoLoad, {
      dir: path.join(__dirname, "..", "routers"),
      options: Object.assign({}),
    });

    await app.ready();
    app.io.on("connection", (socket) => {
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
