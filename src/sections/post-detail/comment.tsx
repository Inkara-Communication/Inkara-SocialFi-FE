import React from 'react';
import Image from 'next/image';
import { CommentIcon, HeartIcon } from '@/components/icons';
import { IComment } from '@/interfaces/comment';
import { cn } from 'tailwind-variants';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';
import { ReactItem } from '@/components/post/react-item';

interface CommentProps {
  data: IComment;
  className?: string;
  onUpdateComment?: (updatedComment: IComment) => void;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
  openMoreOptionsId?: string | null;
  setOpenMoreOptionsId?: (id: string | null) => void;
  onDeleteSuccess?: (isDeleted: boolean) => void;
}

export default function Comment({
  data,
  className,
  setParentComment,
}: CommentProps) {
  const [isLiked, setIsLiked] = React.useState<boolean>(false);

  return (
    <div className={`${cn('group relative pl-4 flex gap-3', className)}`}>
      {!('parentId' in data) && (
        <div className="absolute left-10 top-8 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600" />
      )}

      <div className="flex gap-3 rounded-lg transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0 z-10">
          <Image
            src={data.user?.photo?.url || USER_AVATAR_PLACEHOLDER}
            alt={data.user?.username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Content section */}
        <div className="flex-1 min-w-0">
          <div className="bg-neutral2-2 rounded-[1.25rem] p-4 hover:bg-neutral2-3 transition-colors">
            {/* User info */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-primary">
                  {data.user?.username}
                </span>
                <span className="text-xs text-tertiary">
                  {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div> 
            </div>

            {/* Comment content */}
            <p className="text-sm text-secondary break-words">
              {data.content}
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-4 mt-1">
            <ReactItem
              value={24}
              icon={<HeartIcon isActive={isLiked} />}
              onClick={() => setIsLiked(!isLiked)}
            />

            <ReactItem
              value={0}
              icon={<CommentIcon />}
              onClick={() =>
                setParentComment?.({
                  id: data.id,
                  username: data.user.username,
                })
              }
              className="text-xs text-tertiary gap-1 hover:text-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
