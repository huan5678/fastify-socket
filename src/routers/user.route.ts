import UserController from "@/controllers/user.controller";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/member", async (request: FastifyRequest, reply: FastifyReply) =>
  {
    reply.send({ message: "Hello, member!" });
  });

  fastify.get("/members", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = {
      page: (request.query as { page?: string }).page || '1',
      limit: (request.query as { limit?: string }).limit || '10',
    };
    return UserController.getAllMembers(Object.assign(request, { query }), reply);
  });

  fastify.get("/member/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = {
      id: (request.params as { id?: string }).id || '',
    };
    return UserController.getMemberById(Object.assign(request, { params }), reply);
  });

  fastify.delete("/member/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = {
      id: (request.params as { id?: string }).id || '',
    };
    return UserController.deleteMemberById(Object.assign(request, { params }), reply);
  });
}