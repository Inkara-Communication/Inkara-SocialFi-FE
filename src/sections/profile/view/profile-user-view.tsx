'use client';

import React, { useState, useEffect } from 'react';

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
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nfts, setNfts] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState<'post' | 'nfts'>('post');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const userData = await getUserProfileById(userId);
        setUser(userData.data);

        if (contentType === 'post') {
          const postsResponse = await getPostsByUser(
            { startId: 0, offset: 1, limit: 5 },
            userId
          );
          setPosts(postsResponse.data);
        } else if (contentType === 'nfts') {
          // const nftsResponse = await getNftsByUser(userId);
          // setNfts(nftsResponse.data); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleToggle = (key: string) => {
    switch (key) {
      case 'posts':
        setContentType('post');
        break;
      case 'nfts':
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
      <UserInfo user={user as IUserProfile} />
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
