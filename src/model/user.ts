import mongoose, {Model} from 'mongoose';
import z from 'zod';
import { IUser } from '@/types';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [1, '名稱請大於 1 個字'],
    maxLength: [ 50, '名稱長度過長，最多只能 50 個字' ],
  },
  email: {
    type: String,
    required: [true, 'email為必要資訊'],
    validate: {
      validator(value: string) {
        return z.string().email().safeParse(value).success;
      },
      message: '請填寫正確 email 格式',
    },
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, '密碼為必要資訊'],
    minLength: [ 6, '密碼長度需大於 6 個字' ],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;