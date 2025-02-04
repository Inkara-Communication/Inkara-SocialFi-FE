import React from 'react';
import { IChilrenComment, IComment } from '@/interfaces/comment';
import Comment from './comment';
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
        <ul className={cn(`w-full overflow-y-auto mt-2 space-y-3`, className)}>
          {comments.map((comment: IComment) => (
            <li key={comment.id} className="mb-2">
              {comment.children?.length === 0 ? (
                <Comment
                  data={comment}
                  className='bg-neutral2-2'
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