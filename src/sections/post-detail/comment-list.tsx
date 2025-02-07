import React from 'react';
import { IComment } from '@/interfaces/comment';
import Comment from './comment';
import { cn } from '@/lib/utils';

//--------------------------------------------------------------------------------------------------------

interface CommentListProps {
  comments: IComment[];
  className?: string;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
}

const renderChildren = (
  comments: IComment[],
  parentId: string,
  setParentComment?: any
) => {
  const [openMoreOptionsId, setOpenMoreOptionsId] = React.useState<
    string | null
  >(null);

  const childComments = comments.filter(
    (comment) => comment.parentId === parentId
  );

  if (childComments.length === 0) return null;

  return (
    <ul className="pl-12 relative before:absolute before:left-[20px] before:top-0 before:bottom-0">
      {childComments.map((child, index) => (
        <li key={child.id} className="relative mt-2">
          <div className="absolute left-[-30px] top-[22px] w-[30px] h-[1.5px] bg-neutral1-25" />
          <Comment
            data={child}
            className="bg-neutral2-2 rounded-[1.25rem]"
            setParentComment={setParentComment}
            openMoreOptionsId={openMoreOptionsId}
            setOpenMoreOptionsId={setOpenMoreOptionsId}
          />
          {renderChildren(comments, child.id, setParentComment)}
        </li>
      ))}
    </ul>
  );
};

export default function CommentList({
  comments,
  className,
  setParentComment,
}: CommentListProps) {
  const [openMoreOptionsId, setOpenMoreOptionsId] = React.useState<
    string | null
  >(null);

  return (
    <>
      {comments?.length > 0 && (
        <ul className={cn(`w-full overflow-y-auto`, className)}>
          {comments
            .filter((comment) => !comment.parentId)
            .map((comment) => (
              <li key={comment.id} className="mb-4">
                <Comment
                  data={comment}
                  className="bg-neutral2-2 rounded-[1.25rem]"
                  setParentComment={setParentComment}
                  openMoreOptionsId={openMoreOptionsId}
                  setOpenMoreOptionsId={setOpenMoreOptionsId}
                />
                {renderChildren(
                  comments.filter((c) => c.parentId === comment.id),
                  comment.id,
                  setParentComment
                )}
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
