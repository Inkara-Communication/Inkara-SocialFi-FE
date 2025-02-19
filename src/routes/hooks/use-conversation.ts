import { IMessage } from '@/interfaces/message';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8080/chat', {
  transports: ['websocket'],
  withCredentials: true,
});

export const useConversation = (conversationId?: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('conversation:all', (data) => {
      setConversations(data);
    });

    socket.on('message:created', (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    if (conversationId) {
      socket.emit('conversation:join', { conversationId });
    }

    return () => {
      socket.off('connect');
      socket.off('conversation:all');
      socket.off('message:created');
    };
  }, [conversationId]);

  const sendMessage = (message: string) => {
    if (conversationId) {
      socket.emit('message:create', {
        message,
        chatId: conversationId,
        type: 'conversation',
      });
    }
  };

  return {
    messages,
    conversations,
    sendMessage,
  };
};