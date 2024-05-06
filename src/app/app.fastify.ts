import { fastify } from "fastify";
import { FastifySchemaValidationError } from "fastify/types/schema.js";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
import Logger, { fastifyLogger } from '@/utils/logger';
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";


const app = fastify({
  ignoreTrailingSlash: true,
  logger: fastifyLogger,
});

app.register(cors, {
    maxAge: 3600,
    origin: true,
    credentials: true,
});

app.register(formbody);

app.register(fastifyGracefulShutdown);

app.setErrorHandler((error, _req, res) => {
    Logger.error(error);
 
    const statusCode = error.statusCode ?? 500;
 
    let validation: {
        context: string,
        errors: FastifySchemaValidationError[],
    } | undefined;
 
    if (statusCode >= 500 && statusCode < 600) {
        Logger.error(error.stack);
    } else if (statusCode === 415) {
        Logger.warn(error.stack);
    } else if (typeof error.validation !== "undefined") {
        error.validation.forEach((e) => {
            delete e.message;
        });
 
        validation = {
            context: (error as unknown as { validationContext: string }).validationContext,
            errors: error.validation,
        };
    }
 
    res.code(statusCode);
 
    res.send({ validation });
});

app.setNotFoundHandler((_req, res) => {
    res.status(404);
 
    res.send({});
});

app.addHook("onResponse", (req, res, done) => {
    const method = req.method;
 
    let realIP: string | null;
 
    let ip = req.headers["x-real-ip"];
 
    if (typeof ip === "undefined") {
        ip = req.headers["x-forwarded-for"];
 
        if (typeof ip === "undefined") {
            realIP = req.socket.remoteAddress ?? null;
        } else if (Array.isArray(ip)) {
            realIP = ip[0];
        } else {
            const ips = ip.split(",");
 
            realIP = ips[0];
        }
    } else if (Array.isArray(ip)) {
        realIP = ip[0];
    } else {
        realIP = ip;
    }
 
    const url = req.raw.url ?? null; // should not be null
 
    const userAgent = req.headers["user-agent"] ?? "";
 
    const statusCode = res.statusCode;
 
    Logger.info(`${method} ${url} ${statusCode} - ${userAgent} ${realIP}`);

    done();
});

app.after(() => {
  app.gracefulShutdown((signal, next) => {
      Logger.info(`Received ${signal}. Shutting down...`);
      next();
  });
});

export default app;