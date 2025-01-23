interface IConversation {
  id: number;
  user: {
    avatarUrl: string;
    name: string;
  };
  content: string;
  messages?: IMessage[];
}

interface IMessage {
  user: {
    avatarUrl: string;
    name: string;
  };
  content: string;
  time: string;
  imageUrl?: string;
}

const messages = [
  {
    user: {
      avatarUrl: '',
      name: 'Test 1',
    },
    content: 'Hello world',
    time: '8:30 AM',
    imageUrl: '',
  },
  {
    user: {
      avatarUrl: '',
      name: 'Test 2',
    },
    content: 'Hello world',
    time: '8:30 AM',
  },
  {
    user: {
      avatarUrl: '',
      name: 'Test 3',
    },
    content: 'Hello world',
    time: '8:30 AM',
  },
];

export const _conversations: IConversation[] = [
  {
    id: 1,
    user: {
      avatarUrl: '',
      name: 'Test 1',
    },
    content: 'Test content',
    messages: messages,
  },
  {
    id: 2,
    user: {
      avatarUrl: '',
      name: 'Test 2',
    },
    content: 'Test content 2',
  },
];
