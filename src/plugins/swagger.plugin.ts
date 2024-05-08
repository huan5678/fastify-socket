import 'zod-openapi/extend';
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import { swaggerSpec } from "@/config/swagger-spec";
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi';

export default fp(async (fastify: FastifyInstance) =>
{
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.register(fastifyZodOpenApiPlugin);
  fastify.register(Swagger, {
    openapi: swaggerSpec,
    transform: fastifyZodOpenApiTransform,
    transformObject: fastifyZodOpenApiTransformObject,
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
});
