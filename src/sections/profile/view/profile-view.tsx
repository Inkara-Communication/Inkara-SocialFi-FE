'use client';
import React, { useState } from 'react';
import { useUserProfile } from '@/context/user-context';
import { IPost } from '@/interfaces/post';
import { IUserProfile } from '@/interfaces/user';

import ToggleGroup from '@/components/toggle-group/toggle-group';
import ActivityFeed from '@/components/user-activity-feed/user-activity-feed';

import ProfileHead from '../profile-components/header';
import UserInfo from '../profile-components/user-info';
import { getPostsByUser } from '@/apis/post';

export default function ProfileView() {
  const { userProfile } = useUserProfile();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nfts, setNfts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<'post' | 'nfts'>('post');

  React.useEffect(() => {
    const fetchPosts = async () => {
      if (!userProfile?.id) return;
      setLoading(true);
      try {
        const response = await getPostsByUser(
          { startId: 0, offset: 1, limit: 5 },
          userProfile.id
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userProfile?.id]);

  const fetchNfts = async () => {
    if (!userProfile?.id) return;
    setLoading(true);
    try {
      const response = await getPostsByUser(
        { startId: 0, offset: 1, limit: 5 },
        userProfile.id
      );
      setNfts(response.data);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setError('Failed to load NFTs.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setContentType(key === 'posts' ? 'post' : 'nfts');
    if (key === 'nfts') fetchNfts();
  };

  return (
    <section className="relative w-full h-fit min-h-svh overflow-hidden">
      <ProfileHead />
      <UserInfo user={userProfile as IUserProfile} />
      <ToggleGroup
        items={[
          { key: 'posts', label: 'Posts' },
          { key: 'nfts', label: 'NFTs' },
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
          onDeleted={(isDeleted: boolean) => {
            if (isDeleted) {
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== userProfile?.id)
              );
            }
          }}
        />
      </div>
    </section>
  );
}
