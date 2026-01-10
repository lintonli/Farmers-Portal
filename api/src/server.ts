import express, {json} from 'express'
import dotenv from 'dotenv'
import logger from './utils/logger';
import { checkDatabaseConnection } from './prisma/db';
import userRoutes from './routes/userRoutes';
import cors from 'cors'


dotenv.config();
const app = express();

app.use(
  cors({
    // origin: process.env.FRONTEND_?.replace(/\/$/, ''), // Remove trailing slashURL
    origin:process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(json());

// Routes
app.use('/api/users', userRoutes);

/**
 * Handle uncaught exceptions
 */
process.on("uncaughtException", (err: Error) => {
  logger.error(`Error: ${err.message}`);
  logger.error("Shutting down due to uncaught exception");
  process.exit(1);
});

checkDatabaseConnection().then((response) => {
  return response;
});

const server = app.listen(process.env.PORT, ()=>{
    logger.info(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

/**
 * Handle uncaught promise rejections
 */
process.on("unhandledRejection", (err: Error) => {
  logger.error(err.message);
  logger.error("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});