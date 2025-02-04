import React from 'react';
import Image from 'next/image';
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { HeartIcon, MoreIcon } from '@/components/icons';
import { MoreOptions } from '@/components/post/components/more-options';
import { Typography } from '@/components/typography';
import { useUserProfile } from '@/context/user-context';
import { IComment, IChilrenComment } from '@/interfaces/comment';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@radix-ui/react-alert-dialog';
import { cn } from 'tailwind-variants';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';
import { deleteComment } from '@/apis/comment';

interface CommentProps {
  data: IComment | IChilrenComment;
  className?: string;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
  openMoreOptionsId?: string | null;
  setOpenMoreOptionsId?: (id: string | null) => void;
  onDeleteSuccess?: (isDeleted: boolean) => void;
}

export default function Comment({
  data,
  className,
  setParentComment,
  openMoreOptionsId,
  setOpenMoreOptionsId,
  onDeleteSuccess,
}: CommentProps) {
  const { userProfile } = useUserProfile();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isConfirm, setIsConfirm] = React.useState(false);

  const handleMoreOptions = () => {
    setOpenMoreOptionsId?.(openMoreOptionsId === data.id ? null : data.id);
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(data.id);
      onDeleteSuccess?.(true);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
    setIsConfirm(false);
  };

  const handleConfirmDelete = () => {
    setIsConfirm(true);
  };

  const handleCancelDelete = () => {
    setIsConfirm(false);
  };

  return (
    <div className={cn('group relative pl-4', className)}>
      {/* More Options */}
      {userProfile && data?.userId === userProfile.id && (
        <div className="absolute right-2 top-2">
          <button
            onClick={handleMoreOptions}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full"
          >
            <MoreIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      )}

      {openMoreOptionsId === data.id && (
        <div className="absolute right-8 top-8 z-20">
          <MoreOptions
            onEdit={() => setIsEdit(true)}
            onDelete={handleConfirmDelete}
          />
        </div>
      )}

      {!('parentId' in data) && data.children?.length > 0 && (
        <div className="absolute left-10 top-8 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600" />
      )}

      <div className="flex gap-3 p-3 rounded-lg transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={data.user?.photo?.url || USER_AVATAR_PLACEHOLDER}
            alt={data.user?.username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              {data.user?.username}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <p className="text-sm text-neutral-800 dark:text-neutral-200 break-words">
            {data.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <HeartIcon isActive={false} />
              <span>24</span>
            </button>

            <button
              onClick={() =>
                setParentComment?.({
                  id: data.id,
                  username: data.user.username,
                })
              }
              className="text-xs text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isConfirm} onOpenChange={handleCancelDelete}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Typography level="base2sm" className="text-tertiary">
                Are you sure you want to delete this comment?
              </Typography>
            </AlertDialogDescription>

            <AlertDialogFooter>
              <Button
                onClick={handleCancelDelete}
                className="w-full sm:w-auto"
                child={
                  <Typography level="base2sm" className="p-3 text-tertiary">
                    Cancel
                  </Typography>
                }
              />

              <Button
                onClick={handleDeleteComment}
                className="w-full sm:w-auto"
                child={
                  <Typography level="base2sm" className="p-3 text-red-500">
                    Delete
                  </Typography>
                }
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
