'use client';

import React from 'react';

import { getUserProfileById } from '@/apis/user';
import { IPost } from '@/interfaces/post';
import { IUserProfile } from '@/interfaces/user';

import ToggleGroup from '@/components/toggle-group/toggle-group';
import ActivityFeed from '@/components/user-activity-feed/user-activity-feed';

import ProfileHead from '../profile-components/header';
import UserInfo from '../profile-components/user-info';
import { getPostsByUser } from '@/apis/post';

//--------------------------------------------------------------------------------------------------------

interface ProfileUserViewProps {
  userId: string;
}

export default function ProfileUserView({ userId }: ProfileUserViewProps) {
  const [user, setUser] = React.useState<IUserProfile | null>(null);
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [nfts, setNfts] = React.useState<unknown[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [params, setParams] = React.useState<Record<string, string | boolean>>(
    {}
  );
  const [contentType, setContentType] = React.useState<'post' | 'nfts'>(
    'post'
  );

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfileById(userId);
        setUser(userData.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsByUser(
          { startId: 0, offset: 1, limit: 10 },
          userId
        );
        setPosts(response.data);
        setNfts(response.data.filter((post) => post.type === 'media'));
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts.');
      }
    };

    fetchPosts();
  }, [params, userId]);

  const handleToggle = (key: string) => {
    switch (key) {
      case 'posts':
        setParams({});
        setContentType('post');
        break;
      case 'nft':
        setParams({ type: 'nfts' });
        setContentType('nfts');
        break;
      default:
        console.warn(`Unexpected key: ${key}`);
    }
  };

  if (!user || loading) return <></>;

  return (
    <section className="relative w-full h-fit min-h-svh overflow-hidden">
      <ProfileHead />
      <UserInfo user={user} />
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
          data={contentType === 'nfts' ? nfts : posts}
          loading={loading}
          err={error}
        />
      </div>
    </section>
  );
}
