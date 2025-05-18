import { useEffect, useState } from 'react'
import type { User } from '../types/User'
import Message from '../components/Message';
import type { Message  as MessageType } from '../types/Message';
import Form from '../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { messagesApi, roomsApi } from '../api';
import type { RoomType } from '../types/Room';

const Chat = () => {
  const {id} = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState<RoomType | null>(null);

  const getRoom = async () => {
    if(!id) return;
    try {
      const room = await roomsApi.getRoomById(id);

      setActiveRoom(room);
    } catch (error) {
      console.log(error)
    }

  }

  const getMessage = (message: MessageType) => {
    setMessages(prev => [...prev, message])
  }

  async function loadData() {
    if (!id) return;

    const msgs = await messagesApi.getAllMessages(id);

    setMessages(msgs);
  }

  const createMessage = async (text: string) => {
    if (!id) return;
    const author = localStorage.getItem('user') as string;

    const newMessage = await messagesApi.createMessage({
      author,
      text,
      roomId: id
    });

    setMessages(prev => [...prev, newMessage])
  }

  useEffect(() => {
    if (!id) {
      navigate('/login')
    }

    const userName = localStorage.getItem('user');

    if(userName) {
      setUser({name: userName});
      loadData()
    }

    const socket = new WebSocket('ws://localhost:3000');

    socket.addEventListener('message', (event: {data: string}) => {
      const msg = JSON.parse(event.data);

      getMessage(msg)
    })

    getRoom()
    return () => {
      socket.close()
    }
  }, [])

  return (
    <main className='main'>
      <h1>{user?.name}`s Chat in {activeRoom?.name}</h1>
      <section className='section'>
        {messages.map(msg => {
          const isAuthor = msg.author === user?.name;
          return <Message message={msg} isAuthor={isAuthor}/>
        })}
      </section>
      <Form onCreate={createMessage}/>
    </main>
  )
}

export default Chat;
