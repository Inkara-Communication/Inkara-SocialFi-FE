import React from 'react';
import { IComment } from '@/interfaces/comment';
import Comment from './comment';
import { cn } from '@/lib/utils';

//--------------------------------------------------------------------------------------------------------

interface CommentListProps {
  comments: IComment[];
  className?: string;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
  onLoadMore?: (parentId?: string) => void;
}

const renderChildren = (
  comments: IComment[],
  parentId: string,
  setParentComment?: (parentComment: { id: string; username: string }) => void,
  onLoadMore?: (parentId?: string) => void
) => {
  const childComments = comments.filter(
    (comment) => comment.parentId === parentId
  );
  const parentComment = comments.find((c) => c.id === parentId);
  if (childComments.length === 0) return null;

  return (
    <ul className="pl-12 relative before:absolute before:left-[20px] before:top-0 before:bottom-0">
      {childComments.map((child) => (
        <li key={child.id} className="relative mt-2">
          <div className="absolute left-[-30px] top-[22px] w-[30px] h-[1.5px] bg-neutral1-25" />
          <Comment
            data={child}
            className="bg-neutral2-2 rounded-[1.25rem]"
            setParentComment={setParentComment}
          />
          {renderChildren(comments, child.id, setParentComment, onLoadMore)}
        </li>
      ))}

      {(parentComment?._count?.children ?? 0) > childComments.length && (
        <li className="mt-2 ml-4">
          <button
            onClick={() => onLoadMore?.(parentId)}
            className="text-sm text-blue-500 hover:underline"
          >
            Xem thêm {(parentComment?._count?.children ?? 0) - childComments.length} phản hồi
          </button>
        </li>
      )}
    </ul>
  );
};
export default function CommentList({
  comments,
  className,
  setParentComment,
  onLoadMore,
}: CommentListProps) {
  
  return (
    <>
      {comments?.length > 0 && (
        <ul className={cn(`w-full overflow-y-auto`, className)}>
          {comments
            .filter((comment) => !comment.parentId)
            .map((comment) => {
              return (
                <li key={comment.id} className="mb-4">
                  <Comment
                    data={comment}
                    className="bg-neutral2-2 rounded-[1.25rem]"
                    setParentComment={setParentComment}
                  />
                  {renderChildren(comments, comment.id, setParentComment, onLoadMore)}
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
}
