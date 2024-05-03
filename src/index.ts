import dotenv from 'dotenv';
dotenv.config();
import logger from '@/utils/logger';
import { startServer } from '@/app/server';
import connectDatabase from '@/app/db';

async function initializeApplication()
{
  try {
    await connectDatabase();
    await startServer();
    logger.info('Server started successfully');
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
}

initializeApplication();
