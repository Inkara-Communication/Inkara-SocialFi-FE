'use client';
import React from 'react';

import { useUserProfile } from '@/context/user-context';
import { IPost } from '@/interfaces/post';
import { IUserProfile } from '@/interfaces/user';

import ToggleGroup from '@/components/toggle-group/toggle-group';
import ActivityFeed from '@/components/user-activity-feed/user-activity-feed';

import ProfileHead from '../profile-components/header';
import UserInfo from '../profile-components/user-info';
import { getPostsByUser } from '@/apis/post';

//--------------------------------------------------------------------------------------------------------

export default function ProfileView() {
  const { userProfile } = useUserProfile();
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [nfts, setNfts] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState<Record<string, string | boolean>>({
    userId: userProfile?.id as string,
  });
  const [contentType, setContentType] = React.useState<'post' | 'nfts'>('post');
  const [isDeleted, setIsDeleted] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getPostsByUser(
          { startId: 0, offset: 1, limit: 10 },
          userProfile?.id as string
        );
        console.log(11, response.data)
        setPosts(response.data);
        setNfts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [params, userProfile, isDeleted]);

  const handleToggle = (key: string) => {
    switch (key) {
      case 'posts':
        setParams({});
        setContentType('post');
        break;
      case 'nfts':
        setParams({ type: 'nfts' });
        setContentType('nfts');
        break;
      default:
        console.warn(`Unexpected key: ${key}`);
    }
  };

  return (
    <section className="relative w-full h-fit min-h-svh overflow-hidden">
      <ProfileHead />
      <UserInfo user={userProfile as IUserProfile} />
      <ToggleGroup
        items={[
          { key: 'posts', label: 'Posts' },
          { key: 'nfts', label: 'Nfts' },
        ]}
        className="z-[2] mb-3 relative"
        onChange={handleToggle}
      />
      <div className="px-3 gap-5 h-fit no-scrollbar">
        <ActivityFeed
          contentType={contentType}
          data={
            contentType === 'nfts' ? (nfts as unknown[]) : (posts as IPost[])
          }
          loading={loading}
          err={error}
          onDeleted={setIsDeleted}
        />
      </div>
    </section>
  );
}
