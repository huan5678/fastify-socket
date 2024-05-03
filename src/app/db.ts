import mongoose from 'mongoose';
import Logger from '@/utils/logger';
const { DATABASE_PASSWORD, DATABASE_PATH } = process.env;

mongoose.set("strictQuery", false);

const connectDB = async () =>
{
  Logger.info(`連線至資料庫...`);
  mongoose
  .connect(DATABASE_PATH?.replace("<password>", `${DATABASE_PASSWORD}`) ?? "")
  .then(() => {
    Logger.info("資料庫連線成功");
  })
  .catch((error : Error) => Logger.warn(`資料庫連線錯誤: ${error.message}`));
};

export default connectDB;