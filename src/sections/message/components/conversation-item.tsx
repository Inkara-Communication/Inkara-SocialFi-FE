'use client';

import { Avatar } from '@/components/avatar';
import { Typography } from '@/components/typography';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';
import { IConversation } from '@/interfaces/conversation';

interface IConversationItemProps {
  isReaded: boolean;
  conversation: IConversation;
  onClick?: () => void;
}

export default function ConversationItem({
  isReaded,
  conversation,
  onClick,
}: IConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-neutral2-2 rounded-[1.25rem] p-3 flex justify-start items-start gap-4 group hover:bg-neutral2-10 cursor-pointer"
    >
      {!isReaded && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute top-[0.5rem] right-[0.5rem] ${status}"
        >
          <circle cx="12" cy="12" r="6" fill="#55F08B" />
        </svg>
      )}
      <Avatar src={conversation?.creator?.photo?.url || USER_AVATAR_PLACEHOLDER } alt="avatar" />
      <div className="flex flex-col items-start justify-center gap-1">
        <Typography
          level="base2sm"
          className="text-primary mr-6 flex flex-row-reverse items-center gap-2"
        >
          <Typography level="base2r" className="text-tertiary opacity-50">
            1m
          </Typography>
          {conversation?.creator.fullname}
        </Typography>

        <Typography
          level="captionr"
          className="text-tertiary col-span-2 opacity-80 mr-6 line-clamp-1 group-hover:text-primary"
        >
          {conversation?.messages[0]?.text}
        </Typography>
      </div>
    </div>
  );
}