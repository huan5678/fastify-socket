import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default function (fastify: FastifyInstance) {
  fastify.get("/member", async (request: FastifyRequest, reply: FastifyReply) =>
  {
    reply.send({ message: "Hello, member!" });
  });
}