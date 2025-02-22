import { IPost } from '@/interfaces/post';

import { EmptyContent } from '../empty-content';
import { Post } from '../post';
import { Typography } from '../typography';
import React from 'react';

//-----------------------------------------------------------------------------------------------

interface NewFeedProps {
  contentType: 'post' | 'nfts';
  data: unknown[];
  loading?: boolean;
  err?: string | null;
  className?: string;
  onDeleted?: (isDeleted: boolean) => void;
}

export default function ActivityFeed({
  contentType,
  data,
  loading,
  err,
  onDeleted,
}: NewFeedProps) {
  const [openMoreOptionsId, setOpenMoreOptionsId] = React.useState<
    string | null
  >(null);
  const [expandedPostId, setExpandedPostId] = React.useState<string | null>(
    null
  );

  const handleToggleComments = (postId: string) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const posts = (
    <ul className="w-full h-full mt-3">
      {(data as IPost[]).map((post) => (
        <li key={post.id} className="mb-2">
          <Post
            data={post}
            onDeleteSuccess={onDeleted}
            openMoreOptionsId={openMoreOptionsId}
            setOpenMoreOptionsId={setOpenMoreOptionsId}
            showComments={expandedPostId === post.id}
            onToggleComments={() => handleToggleComments(post.id)}
          />
        </li>
      ))}
    </ul>
  );

  // const media = (
  //   <div className="w-full h-fit grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
  //     {data.map((media, index) => (
  //       <Link key={`${media.image}-${index}`} href={`/posts/${media.id}`}>
  //         <Image
  //           src={media.image}
  //           width={633}
  //           height={400}
  //           alt={'media'}
  //           className="w-full h-[12rem] rounded-[1.5rem] object-cover"
  //         />
  //       </Link>
  //     ))}
  //   </div>
  // );

  return (
    <div className="">
      {loading ? (
        <div>Loading posts...</div>
      ) : err ? (
        <div className="text-white">Error loading posts: {err}</div>
      ) : data.length === 0 ? (
        <EmptyContent
          content={
            <Typography level="base2sm" className="text-tertiary">
              This user hasn&apos;t posted anything yet
            </Typography>
          }
        />
      ) : contentType === 'post' ? (
        posts
      ) : (
        posts
      )}
    </div>
  );
}
