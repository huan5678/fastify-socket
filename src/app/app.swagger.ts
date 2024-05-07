import { FastifyInstance } from "fastify";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import { swaggerSpec } from "@/app/app.swagger-spec";

export async function afterRegisterRoutes(fastify: FastifyInstance) {
  fastify.register(Swagger, {
    openapi: swaggerSpec,
  });

  fastify.register(SwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => { return swaggerObject },
  transformSpecificationClone: true
});

  fastify.ready((err) => {
    if (err) throw err;
    fastify.swagger();
  });
}