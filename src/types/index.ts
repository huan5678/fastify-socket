import { Document } from "mongoose";

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