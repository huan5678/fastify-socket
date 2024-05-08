import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import User from "@/models/user.model";
import { IUser } from "@/types";

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
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      request.user = user as IUser;
    } catch (err) {
      reply.send(err);
    }
  });
});