'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/avatar';
import { CloseIcon, MoreIcon } from '@/components/icons';
import { Typography } from '@/components/typography';
import { Button } from '@/components/button';
import { ChatInput, MessageItem } from '../components';
import { useConversation } from '@/routes/hooks/use-conversation';
import { Socket } from 'socket.io-client';

type ConversationDetailProps = {
  id: string;
  socket: Socket;
};

export default function ConversationDetail({ id }: ConversationDetailProps) {
  const router = useRouter();
  const { messages, sendMessage } = useConversation(id);

  const handleBack = () => {
    router.push('/messages');
  };

  return (
    <section className="block md:hidden w-full h-full flex-col bg-surface lg:flex">
      <section
        id="conversation-header"
        className="w-full flex items-center gap-4 py-3 pr-6 pl-3"
      >
        <Avatar src="" alt="avatar" size={40} />

        <Typography level="base2m" className="text-primary grow">
          John Doe {/* Tạm thời hardcode, có thể thay bằng dữ liệu từ API */}
        </Typography>

        <Button className="p-2.5" child={<MoreIcon />} />

        <Button
          onClick={handleBack}
          className="p-2.5 lg:hidden"
          child={<CloseIcon />}
        />
      </section>

      <section
        id="chat-container"
        className="flex flex-col gap-2 h-[calc(100vh-150px)] overflow-y-auto items-center justify-start p-3"
      >
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </section>

      <ChatInput onSendMessage={sendMessage} />
    </section>
  );
}