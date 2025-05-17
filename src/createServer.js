import express from 'express';
import cors from 'cors';
import { router as roomsRouter } from './routes/room.route.js';
import { router as messagesRouter } from './routes/message.route.js';

export function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/rooms', roomsRouter);
  app.use('/messages', messagesRouter);

  const PORT = process.env.PORT || 3005;
  const server = app.listen(PORT, () => {
    // console.log(`Server is listening on port: http://localhost:${PORT}`);
  });

  return server;
}
