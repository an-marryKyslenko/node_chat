import { WebSocketServer } from 'ws';

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (client) => {
    // console.log('A new client connected');

    client.on('message', (data) => {
      // console.log(data);
    });
  });
};
