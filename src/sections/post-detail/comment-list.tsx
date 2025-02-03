import React from 'react';
import Image from 'next/image';
import { IChilrenComment, IComment } from '@/interfaces/comment';
import { cn } from '@/lib/utils';

//--------------------------------------------------------------------------------------------------------

interface CommentListProps {
  comments: IComment[];
  className?: string;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
}

export default function CommentList({
  comments,
  className,
  setParentComment,
}: CommentListProps) {
  return (
    <>
      {comments?.length > 0 && (
        <ul className={cn(`w-full overflow-y-auto mt-2`, className)}>
          {comments.map((comment: IComment) => (
            <li key={comment.id} className="mb-2">
              {comment.children?.length === 0 ? (
                <Comment
                  data={comment}
                  className="bg-neutral2-2"
                  setParentComment={setParentComment}
                />
              ) : (
                <ul className="rounded-[1.25rem] hover:bg-neutral2-3">
                  <li>
                    <Comment
                      className='rounded-bl-none rounded-br-none after:content-[""] after:absolute after:top-[64px] after:left-[33.5px] after:bottom-0 after:w-[1.5px] after:bg-neutral2-10 bg-none hover:bg-neutral2-2'
                      data={comment}
                    />
                  </li>
                  {comment.children?.map(
                    (reply: IChilrenComment, index: number) => (
                      <li key={reply.id} className=" ">
                        <Comment
                          className={`rounded-none ${
                            index === (comment.children?.length ?? 0) - 1
                              ? 'rounded-tl-none rounded-tr-none rounded-bl-[1.25rem] rounded-br-[1.25rem]'
                              : 'after:content-[""] after:absolute after:top-[64px] after:left-[33.5px] after:bottom-0 after:w-[1.5px] after:bg-neutral2-10 bg-none '
                          }`}
                          data={reply}
                        />
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

interface CommentProps {
  data: IComment | IChilrenComment;
  className?: string;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
}

const Comment = ({ data, className, setParentComment }: CommentProps) => {
  return (
    <div className={cn('group relative pl-4', className)}>
      {!('parentId' in data) && data.children.length > 0 && (
        <div className="absolute left-10 top-8 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600" />
      )}

      <div className="flex gap-3 p-3 rounded-lg transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0">
        <Image
          src={data.user.photo.url || '/default-avatar.png'}
          alt={data.user.username}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              {data.user.username}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          <p className="text-sm text-neutral-800 dark:text-neutral-200 break-words">
            {data.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <HeartIcon className="w-4 h-4" />
              <span>24</span>
            </button>
            
            <button
              onClick={() => setParentComment?.({ id: data.id, username: data.user.username })}
              className="text-xs text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>

        {/* More Options */}
      </div>
    </div>
  );
};

// Utility Icons
const HeartIcon = ({ className }: { className?: string }) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);