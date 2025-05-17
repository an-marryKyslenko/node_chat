import { messagesApi } from '../api/messagesApi.js';

const getAllMessages = async (req, res) => {
  const { roomId } = req.query;

  if (!roomId) {
    res.status(400).json({ message: "Coudn't find a room" });

    return;
  }

  const messages = await messagesApi.getAllMessages(roomId);

  if (!messages) {
    res.statusCode(400);

    return;
  }
  res.status(200).json(messages);
};

const createMessage = (req, res) => {
  const data = req.body;

  if (!data) {
    res.status(400).json({ message: "Can't create message" });

    return;
  }

  const id = crypto.randomUUID();
  const newMessage = {
    id,
    ...data,
    date: new Date().toLocaleTimeString(),
  };

  messagesApi.saveMessageToJson(newMessage);
  res.status(201).json(newMessage);
};

export const messagesController = {
  getAllMessages,
  createMessage,
};
