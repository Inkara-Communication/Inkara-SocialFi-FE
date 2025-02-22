'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useBreakPoint from '@/hooks/use-breakpoint';
import { ConversationSidebar } from '../components';
import EmptyContent from '@/components/empty-content/empty-content';
import { Typography } from '@/components/typography';
import ConversationDetailPage from './conversation-detail-view';

const socket = io('ws://localhost:8080/chat', {
  transports: ['websocket'],
  withCredentials: true,
});

export default function Message() {
  const { breakpoint } = useBreakPoint();
  const [showDetailOnly, setShowDetailOnly] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  // const [rooms, setRooms] = useState([]);

  const isMobile = breakpoint === 'sm';
  const hideConsolidation = breakpoint === 'sm' || breakpoint === 'md';

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('conversation:all', (data) => {
      setConversations(data);
    });

    // socket.on('room:all', (data) => {
    //   setRooms(data);
    // });

    socket.on('message:created', (message) => {
      // Handle new message
      console.log('New message:', message);
    });

    return () => {
      socket.off('connect');
      socket.off('conversation:all');
      socket.off('room:all');
      socket.off('message:created');
    };
  }, []);

  const handleConversationClick = (id: string) => {
    if (isMobile) {
      setShowDetailOnly(true);
    }
    setSelectedConversationId(id);
    socket.emit('conversation:join', { conversationId: id });
  };

  return (
    <section className="w-full h-full flex flex-col justify-start lg:flex-row lg:items-start">
      {!isMobile || !showDetailOnly ? (
        <ConversationSidebar
          conversations={conversations}
          onConversationClick={(id) => handleConversationClick(id)}
        />
      ) : null}

      {!hideConsolidation ? (
        <section className="bg-surface h-screen w-full grow flex flex-col justify-center items-center gap-3 py-7">
          {selectedConversationId ? (
            <ConversationDetailPage
              id={selectedConversationId}
              socket={socket}
            />
          ) : (
            <EmptyContent
              content={
                <Typography level="base2sm" className="text-secondary">
                  Select conversation to start messaging
                </Typography>
              }
              image="/svg/ai_data_consolidation.svg"
            />
          )}
        </section>
      ) : selectedConversationId ? (
        <ConversationDetailPage id={selectedConversationId} socket={socket} />
      ) : null}
    </section>
  );
}