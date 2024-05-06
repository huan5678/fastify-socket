import dotenv from 'dotenv';
dotenv.config();
import Logger from '@/utils/logger';
import { startServer } from '@/app/server';
import connectDatabase from '@/app/db';

async function initializeApplication()
{
  try {
    await connectDatabase();
    await startServer();
    Logger.info('Server started successfully');
  } catch (error) {
    Logger.error('Error starting server', error);
    process.exit(1);
  }
}

initializeApplication();
