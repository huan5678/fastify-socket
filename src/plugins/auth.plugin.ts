import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import { FastifyReply, FastifyRequest } from "fastify";

export default fp(async (fastify) =>
{
  const publicKey = Buffer.from(process.env.JWT_SECRET || "", "base64").toString("ascii");

  if (!publicKey)
  {
    fastify.log.error("Public key is required");
  }

  fastify.register(jwt, {
    secret: {
      public: publicKey,
    }
  });
  fastify.register(auth);

  fastify.decorate("verifyJWT", async (request: FastifyRequest, reply: FastifyReply) =>
  {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});