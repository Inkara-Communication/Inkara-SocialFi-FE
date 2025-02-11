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

export default function ProfileView() {
  const { userProfile } = useUserProfile();
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [nfts, setNfts] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [contentType, setContentType] = React.useState<'post' | 'nfts'>('post');
  const [hasFetchedNFTs, setHasFetchedNFTs] = React.useState<boolean>(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getPostsByUser(
        { startId: 0, offset: 1, limit: 5 },
        userProfile?.id as string
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
      fetchPosts();
  });

  const fetchNfts = async () => {
    if (!hasFetchedNFTs) {
      setLoading(true);
      try {
        // const response = await getNftsByUser(userProfile?.id as string);
        // setNfts(response.data);
        setHasFetchedNFTs(true);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError('Failed to load NFTs.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = (key: string) => {
    if (key === 'posts') {
      setContentType('post');
    } else if (key === 'nfts') {
      setContentType('nfts');
      fetchNfts();
    }
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
          onDeleted={() => setPosts((prevPosts) => prevPosts.filter(post => post.id !== ''))}
        />
      </div>
    </section>
  );
}
