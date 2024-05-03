import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fastifyIO from 'fastify-socket.io';
import { Server } from 'socket.io';
import logger, { fastifyLogger } from '@/utils/logger';
import errorHandlerPlugin from '@/plugins/error-handler-plugin';

const app = fastify({
  logger: fastifyLogger,
});

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}

const startServer = async () =>
{
  const port = process.env.PORT || '3000';
  const startTime = Date.now();
  try {
    app.get('/', (request: FastifyRequest, reply: FastifyReply) =>
    {
      const healthCheck = {
        status: true,
        message: 'OK',
        uptime: process.uptime(),
        timestamp: new Date(startTime).toLocaleString(),
        host: request.headers.host
      };
      reply.send(healthCheck);
    });

    app.register(fastifyIO)
    await errorHandlerPlugin(app);

    app.ready().then(() => {
      app.io.on('connection', (socket) => {
          logger.info(`New connection: ${socket.id}`);
          socket.on('disconnect', () => {
              logger.info(`Connection closed: ${socket.id}`);
          });
      });
    });

    await app.listen({
      port: parseInt(port),
    })

    const endTime = Date.now();
    const startupTime = (endTime - startTime) / 1000;
    logger.info(`Server started in ${startupTime} seconds`);

  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

export { startServer };