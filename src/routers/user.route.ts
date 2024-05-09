import UserController from "@/controllers/user.controller";
import { IUser, UserUpdateBody } from "@/types";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Schemas } from '@/schemas/user.schema';

export default async function (fastify: FastifyInstance)
{
  fastify.post(
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
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => await UserController.createAccount(request, reply)
  );
  fastify.get(
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
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "Hello, member!" });
    }
  );

  fastify.get(
    "/members",
    {
      schema: {
        description: "Get members",
        tags: ["Member"],
        summary: "Get members",
        querystring: Schemas.userQueryStrings,
        response: {
          200: Schemas.userResponse,
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: { page: string; limit: string } }>, reply: FastifyReply) => await UserController.getAllMembers(request, reply)
  );

  fastify.get(
    "/member/:id",
    {
      schema: {
        description: "Get member by id",
        tags: [ "Member" ],
        summary: "Get member by id",
        params: Schemas.userIdParams,
        response: {
          200: Schemas.getUserById.response,
          404: Schemas.notFindUserError,
        },
      }
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => await UserController.getMemberById(request, reply)
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
        params: Schemas.userIdParams,
        body: Schemas.userUpdateBody,
        response: {
          200: Schemas.getUserById.response,
          404: Schemas.notFindUserError,
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
        params: Schemas.userIdParams,
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          404: Schemas.notFindUserError,
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
