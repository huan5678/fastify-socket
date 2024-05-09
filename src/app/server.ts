import { FastifyRequest, FastifyReply } from "fastify";
import Logger from "@/utils/logger";
import app from "@/app/app.fastify";

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
