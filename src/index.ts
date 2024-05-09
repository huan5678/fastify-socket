import dotenv from 'dotenv';
dotenv.config();
import Logger from '@/utils/logger';
import { startServer } from '@/app/server';

async function initializeApplication()
{
  try {
    await startServer();
    Logger.info('Server started successfully');
  } catch (error) {
    Logger.error('Error starting server', error);
    process.exit(1);
  }
}

initializeApplication();
