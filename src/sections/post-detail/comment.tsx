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
import { IComment } from '@/interfaces/comment';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@radix-ui/react-alert-dialog';
import { Portal } from '../../components/portal';
import { cn } from 'tailwind-variants';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';
import { deleteComment, updateComment } from '@/apis/comment';
import { IUserProfile } from '@/interfaces/user';

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
  onUpdateComment,
  setParentComment,
  openMoreOptionsId,
  setOpenMoreOptionsId,
  onDeleteSuccess,
}: CommentProps) {
  const { userProfile } = useUserProfile();
  const [localData, setLocalData] = React.useState(data);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState<boolean>(false);

  const handleMoreOptions = () => {
    setOpenMoreOptionsId?.(openMoreOptionsId === data.id ? null : data.id);
  };

  const handleUpdateComment = async (updatedComment: IComment) => {
    await updateComment(data.id, updatedComment.content);
    setLocalData(updatedComment);
    onUpdateComment?.(updatedComment);
    setIsEdit(false);
    handleMoreOptions();
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
  console.log(openMoreOptionsId);
  return (
    <div className={`${cn('group relative pl-4 flex gap-3', className)}`}>
      {/* {openMoreOptionsId === localData.id && (
        <div className="absolute right-0 top-full mt-2 z-20 bg-white shadow-lg rounded-md">
          <MoreOptions
            onEdit={() => setIsEdit(true)}
            onDelete={handleConfirmDelete}
          />
        </div>
      )} */}

      {!('parentId' in localData) && (
        <div className="absolute left-10 top-8 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600" />
      )}

      <div className="flex gap-3 rounded-lg transition-colors">
        {/* Avatar */}
        <div className="flex-shrink-0 z-10">
          <Image
            src={localData.user?.photo?.url || USER_AVATAR_PLACEHOLDER}
            alt={localData.user?.username}
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
                  {localData.user?.username}
                </span>
                <span className="text-xs text-tertiary">
                  {new Date(localData.createdAt).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {localData.creatorId === (userProfile as IUserProfile).id && (
                <button onClick={handleMoreOptions} className="relative ml-2">
                  <MoreIcon />
                  {openMoreOptionsId === localData.id && (
                    <div className="absolute right-0 top-full mt-2 z-20">
                      <MoreOptions
                        onEdit={() => setIsEdit(true)}
                        onDelete={handleConfirmDelete}
                      />
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Comment content */}
            <p className="text-sm text-secondary break-words">
              {localData.content}
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-4 mt-1">
            <button className="flex items-center gap-1 text-xs text-tertiary hover:text-blue-500 transition-colors size-[2rem]">
              <HeartIcon isActive={false} />
              <span>24</span>
            </button>

            <button
              onClick={() =>
                setParentComment?.({
                  id: localData.id,
                  username: localData.user.username,
                })
              }
              className="text-xs text-tertiary gap-1 hover:text-blue-500 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      {/* Edit Comment Dialog */}
      {isEdit && (
        <Portal>
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-4 bg-neutral2-2 rounded-lg">
            <div className="flex items-center gap-3">
              <Image
                src={localData.user?.photo?.url || USER_AVATAR_PLACEHOLDER}
                alt={localData.user?.username}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={localData.content}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      content: e.target.value,
                    })
                  }
                  className="w-full h-24 p-2 bg-neutral2-3 rounded-lg"
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsEdit(false)}
                    className="text-tertiary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateComment(localData)}
                    className="text-red-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Portal>
      )}
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
                  Confirm
                </Typography>
              }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
