import { usePathname } from 'next/navigation';
import React from 'react';

import { useUserProfile } from '@/context/user-context';

import { IFollowing, ListFollowerType } from '@/interfaces/follower';
import { cn } from '@/lib/utils';

import { SplashScreen } from '@/components/loading-screen';
import ProfileCard from '@/components/profile-card/profile-card';
import ToggleGroup from '@/components/toggle-group/toggle-group';
import { followAction, listFollows } from '@/apis/follow';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';

//-------------------------------------------------------------------------

type SidebarRightProps = {
  className?: string;
};

export default function SidebarRight({ className }: SidebarRightProps) {
  const [activeTab, setActiveTab] = React.useState('1');
  const pathName = usePathname();
  const [followings, setFollowings] = React.useState<IFollowing[]>([]);
  const [isLoading, setIsLoading] = React.useState({
    followings: true
  });
  const [error, setError] = React.useState({ posts: '', followings: '' });
  const { userProfile } = useUserProfile();

  React.useEffect(() => {
    const fetchFollowersData = async () => {
      if (activeTab !== '1' || !userProfile?.id) return;

      setIsLoading((prev) => ({ ...prev, followings: true }));
      try {
        const response = await listFollows(
          'DAY',
          ListFollowerType.LIST_FOLLOWINGS,
          0,
          1,
          5
        );
        setFollowings(response.data);
      } catch (error) {
        console.error('Error fetching followings:', error);
        setError((prev) => ({
          ...prev,
          followings: 'Failed to load followings.',
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, followings: false }));
      }
    };

    fetchFollowersData();
  }, [activeTab, userProfile?.id]);

  const handleFollow = async (id: string) => {
    try {
      await followAction(id);
      setFollowings((prevFollowers) =>
        prevFollowers.map((following) => following
        )
      );
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const isFollowingPage = pathName === '/followings';

  return (
    <section
      className={cn(
        `bg-cushion h-screen relative z-10 w-85 2xl:w-120 transition-[width] duration-300 ease-in-out`,
        className
      )}
    >
      <div className="w-full h-full flex flex-col bg-surface-3 p-3 gap-3">
        {!isFollowingPage && (
          <ToggleGroup
            className="w-full p-1 flex justify-between items-center bg-neutral3-60 rounded-[6.25rem]"
            items={[
              { key: '1', label: 'List friend' },
              { key: '2', label: 'Who to follow' },
            ]}
            onChange={handleTabChange}
          />
        )}
        <div className="flex flex-col gap-2">
          {isLoading.followings ? (
            <SplashScreen />
          ) : error.followings ? (
            <div>{error.followings}</div>
          ) : (
            followings.map((user) => (
              <ProfileCard
                key={user.following.id}
                user={{
                  id: user.following.id,
                  username: user.following.username,
                  photo: { url: user.following.photo?.url || USER_AVATAR_PLACEHOLDER},
                  address: user.following.address,
                }}
                onFollow={() => handleFollow(user.following.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
