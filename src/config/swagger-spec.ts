import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'

export const swaggerSpec: FastifyDynamicSwaggerOptions[ "openapi" ] = {
  openapi: '3.0.0',
  info: {
    title: 'Test swagger',
    description: 'Testing the Fastify swagger API',
    version: '0.1.0'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  components: {
      securitySchemes: {
          bearerAuth: {
              type: "http",
              scheme: "bearer",
              description: "Example",
          },
      },
  },
  tags: [
      {
          name: "Member",
          description: "Operations about member",
      },
  ],
};