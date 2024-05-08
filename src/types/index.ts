import { Document } from "mongoose";
import { JWT } from '@fastify/jwt';
import { Server } from "socket.io";

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT,
  }
  export interface FastifyInstance
  {
    io: Server;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

export interface RequestParams
{
  name: string;
}

export interface ResponseBody {}

export interface RequestBody {}

export interface RequestQuery
{
  message: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateBody
{
  [key: string]: string | Date | { facebook?: string; twitter?: string; instagram?: string };
}

