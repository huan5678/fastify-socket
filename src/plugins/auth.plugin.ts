import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "@/utils/prismaClient";

export default fp(async (fastify: FastifyInstance) =>
{
  const secretKey = Buffer.from(process.env.JWT_SECRET || "", "base64").toString("ascii");

  if (!secretKey)
  {
    fastify.log.error("Secret key is required");
  }

  fastify.register(jwt, {
    secret: {
      public: secretKey,
    }
  });
  fastify.register(auth);

  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) =>
  {
    try {
      await request.jwtVerify();
      const decodedToken = request.user as { id: string };
      const userId = decodedToken.id;
      const user = await prisma.user.findUnique({
            where: { id: userId },
        });
      if (!user) {
        throw new Error("User not found");
      }
      request.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      };
    } catch (err) {
      reply.send(err);
    }
  });
});