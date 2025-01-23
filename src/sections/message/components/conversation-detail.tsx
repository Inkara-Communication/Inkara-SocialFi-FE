import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { CloseIcon, MoreIcon } from '@/components/icons';
import { Typography } from '@/components/typography';

import MessageItem from './message-item';
import ChatInput from './chat-input';

//----------------------------------------------------------------------

const messages = [
  {
    user: {
      avatarUrl: '',
      name: 'Apple hi',
    },
    content: 'Hello, how can I help you today?',
    time: '8:30 AM',
    imageUrl: '',
  },
  {
    user: {
      avatarUrl: '',
      name: 'Samsung',
    },
    content: 'Hello, how can I help you today?',
    time: '8:30 AM',
  },
  {
    user: {
      avatarUrl: '',
      name: 'Apple Releases',
    },
    content: 'Hello, can I help you?',
    time: '8:30 AM',
  },
];

const _conversations = [
  {
    id: 1,
    user: {
      avatarUrl: '',
      name: 'John Doe',
    },
    content: 'Test content',
    messages: messages,
  },
  {
    id: 2,
    user: {
      avatarUrl: '',
      name: 'John Doe 2',
    },
    content: 'Test content 2',
  },
];

export default function ConversationDetail() {
  const handleBack = () => {
    // navigate('/messages');
  };

  return (
    <section className="block md:hidden w-full h-full flex-col bg-surface lg:flex">
      <section
        id="conversation-header"
        className="w-full flex items-center gap-4 py-3 pr-6 pl-3"
      >
        <Avatar src="" alt="avatar" size={40} />

        <Typography level="base2m" className="text-primary grow">
          {_conversations[0].user.name}
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
        {_conversations[0].messages?.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </section>

      <ChatInput />
    </section>
  );
}
