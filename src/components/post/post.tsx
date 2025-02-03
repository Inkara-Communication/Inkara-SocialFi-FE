'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { deletePost } from '@/apis/post';
import { IPost } from '@/interfaces/post';
import { IUserProfile } from '@/interfaces/user';
import { useUserProfile } from '@/context/user-context';

import { cn } from '@/lib/utils';
import { relativeTime } from '@/utils/relative-time';

import { Avatar } from '../avatar';
import { CommentIcon, HeartIcon, MoreIcon } from '../icons';
import UpdatePost from '../new-post/update-post';
import { Portal } from '../portal';
import { Typography } from '../typography';
import { MoreOptions } from './components/more-options';
import { ReactItem } from './react-item';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../alert-dialog';
import { Button } from '../button';
import { usePost } from '@/context/post-context';
import { hasLiked, likeAction } from '@/apis/like';

//-------------------------------------------------------------------------

interface PostProps {
  data: IPost;
  className?: string;
  onUpdatePost?: (updatedPost: IPost) => void;
  setParentComment?: (parentComment: { id: string; username: string }) => void;
  onDeleteSuccess?: (isDeleted: boolean) => void;
  type?: string;
  openMoreOptionsId?: string | null;
  setOpenMoreOptionsId?: (id: string | null) => void;
}

export default function Post({
  data,
  className,
  onUpdatePost,
  onDeleteSuccess,
  openMoreOptionsId,
  setOpenMoreOptionsId,
}: PostProps) {
  const { userProfile } = useUserProfile();
  const { posts } = usePost();
  const [localData, setLocalData] = React.useState(data);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const isPostType = data.type === 'text' || data.type === 'media';

  React.useEffect(() => {
    if (!posts) return;
    (async () => {
      setIsLiked(await hasLiked('post', data.id));
    })();
  }, [data.id, posts, userProfile?.id]);

  const handleLikeClick = async () => {
    if (!isPostType) return;

    const updatedData = {
      ...localData,
    } as IPost;

    setLocalData(updatedData);
    if (onUpdatePost) {
      onUpdatePost(updatedData);
    }

    try {
      if (isLiked) {
        await likeAction('post', localData.id);
        setIsLiked(false);
      } else {
        await likeAction('post', localData.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
      setLocalData(localData);
      if (onUpdatePost) {
        onUpdatePost(localData as IPost);
      }
    }
  };

  const handleMoreOptions = () => {
    setOpenMoreOptionsId?.(openMoreOptionsId === data.id ? null : data.id);
  };

  const handleUpdatePost = (updatedPost: IPost) => {
    setLocalData(updatedPost);
    onUpdatePost?.(updatedPost);
    setIsEdit(false);
    handleMoreOptions();
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(data.id);
      onDeleteSuccess?.(true);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
    setIsConfirm(false);
  };

  const handleConfirmDelete = () => {
    setIsConfirm(true);
  };

  const handleCancelDelete = () => {
    setIsConfirm(false);
  };

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEdit) {
        setIsEdit(false);
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isEdit]);

  return (
    <div
      className={cn(
        'relative w-full h-fit flex flex-col rounded-[1.25rem] p-3 bg-neutral2-2 gap-3 [transition:background_.2s] hover:bg-neutral2-5',
        className
      )}
    >
      <div className="flex items-start gap-5">
        <Link
          href={`/profile/${localData.creatorId}`}
          className="cursor-pointer"
        >
          <Avatar
            alt="avatar"
            src={localData?.user?.photo?.url || ''}
            size={44}
          />
        </Link>
        <div className="w-full flex flex-col gap-2">
          <div className="relative z-0 flex justify-items-auto items-center">
            <Link
              href={`/profile/${localData.creatorId}`}
              className="cursor-pointer"
            >
              <Typography
                level="base2m"
                className="text-primary font-bold justify-self-start opacity-80 mr-4"
              >
                {localData?.user?.username}
              </Typography>
            </Link>
            <Typography
              level="captionr"
              className="text-tertiary justify-self-start grow opacity-45"
            >
              {relativeTime(new Date(localData.createdAt))}
            </Typography>

            {data.creatorId === (userProfile as IUserProfile).id && (
              <MoreIcon onClick={handleMoreOptions} />
            )}
            {openMoreOptionsId === data.id && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenMoreOptionsId?.(null)}
              />
            )}
          </div>
          <Link href={`/posts/${localData.id}`} className="cursor-pointer">
            <Typography level="body2r" className="text-secondary opacity-80">
              {localData.content}
            </Typography>
          </Link>

          {(localData as IPost).photo?.url && (
            <Link href={`/posts/${localData.id}`}>
              <Image
                width={400}
                height={400}
                src={localData?.photo?.url || ''}
                alt="post-image"
                className="max-h-[400px] w-full rounded-[1.5rem] object-cover"
              />
            </Link>
          )}
        </div>
        {openMoreOptionsId === data.id && (
          <MoreOptions
            onEdit={() => setIsEdit(true)}
            onDelete={handleConfirmDelete}
          />
        )}
      </div>

      <div className="flex justify-end items-center md:justify-start md:pl-[48px]">
        <ReactItem
          value={(localData as IPost).likes.length}
          icon={<HeartIcon isActive={isPostType && !isLiked} />}
          onClick={handleLikeClick}
        />

        {/* {isPostType ? ( */}
        <ReactItem
          value={(localData as IPost).comments.length || 0}
          icon={<CommentIcon />}
        />
        {/* ) : (
          <button onClick={handleReplyComment}>
            <CommentIcon />
          </button> */}
        {/* )} */}
      </div>

      {isEdit && (
        <Portal>
          <UpdatePost
            postId={data.id}
            onUpdateSuccess={handleUpdatePost}
            onClose={() => setIsEdit(false)}
          />
        </Portal>
      )}

      <AlertDialog open={isConfirm} onOpenChange={handleCancelDelete}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Typography level="base2sm" className="text-tertiary">
              Are you sure you want to delete this post?
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
              onClick={handleDeletePost}
              className="w-full sm:w-auto"
              child={
                <Typography level="base2sm" className="p-3 text-tertiary">
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
