import UserController from "@/controllers/user.controller";
import { IUser, UserUpdateBody } from "@/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Schemas } from '@/schemas/user.schema';
import {
  type FastifyZodOpenApiSchema,
  type FastifyZodOpenApiTypeProvider,
} from 'fastify-zod-openapi';

export default async function (fastify: FastifyInstance)
{
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().post(
    "/member",
    {
      schema: {
        description: "Create Account",
        tags: ["Member"],
        summary: "Create Account",
        body: Schemas.createUser.body,
        response: {
          200: Schemas.createUser.response,
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = (request.body as IUser) || {};
      return UserController.createAccount(
        Object.assign(request, { body }),
        reply
      );
    }
  );
  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/member",
    {
      preHandler: fastify.authenticate, //onRequest global hook, preHandler route hook
      schema: {
        description: "Get member",
        tags: ["Member"],
        summary: "Get member",
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      } satisfies FastifyZodOpenApiSchema,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "Hello, member!" });
    }
  );

  fastify.withTypeProvider<FastifyZodOpenApiTypeProvider>().get(
    "/members",
    {
      schema: {
        description: "Get members",
        tags: ["Member"],
        summary: "Get members",
        params: Schemas.userQueryStrings,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
          message: { type: "string" },
          status: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    // 設定您用戶對象的具體屬性
                  }
                }
              },
              pagination: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  limit: { type: "integer" },
                  totalCount: { type: "integer" },
                  totalPages: { type: "integer" },
                }
              },
            }
          },
        },
      },
    },
      } satisfies FastifyZodOpenApiSchema,
    },
    async (request: FastifyRequest<{ Querystring: { page: string; limit: string } }>, reply: FastifyReply) => await UserController.getAllMembers(request, reply)
  );

  fastify.get(
    "/member/:id",
    {
      schema: {
        description: "Get member by id",
        tags: ["Member"],
        summary: "Get member by id",
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the user identifier, as userId",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = {
        id: (request.params as { id?: string }).id || "",
      };
      return await UserController.getMemberById(
        Object.assign(request, { params }),
        reply
      );
    }
  );

  fastify.patch(
    "/member/:id",
    {
      preHandler: fastify.authenticate,
      schema: {
        description: "Update member by id",
        tags: ["Member"],
        summary: "Update member by id",
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the user identifier, as userId",
            },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string" },
            facebook: { type: "string" },
            twitter: { type: "string" },
            instagram: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) =>
    {
      const user = request.user as IUser;
      const params = {
        id: (request.params as { id?: string }).id || "",
      };
      const body = (request.body as UserUpdateBody) || {};
      return await UserController.updateMemberData(
        Object.assign(request, { params, body, user }),
        reply
      );
    }
  );

  fastify.delete(
    "/member/:id",
    {
      preHandler: fastify.authenticate,
      schema: {
        description: "Delete member by id",
        tags: ["Member"],
        summary: "Delete member by id",
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "the user identifier, as userId",
            },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = {
        id: (request.params as { id?: string }).id || "",
      };
      return await UserController.deleteMemberById(
        Object.assign(request, { params }),
        reply
      );
    }
  );
}
