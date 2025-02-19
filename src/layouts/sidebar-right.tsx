import { usePathname } from 'next/navigation';
import React from 'react';

import { useUserProfile } from '@/context/user-context';

import { IFollower, IFollowing } from '@/interfaces/follower';
import { cn } from '@/lib/utils';

import ProfileCard from '@/components/profile-card/profile-card';
import ToggleGroup from '@/components/toggle-group/toggle-group';
import { followAction, listFollows, whoToFollow } from '@/apis/follow';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';
import { UserFilterByOption } from '@/apis/dto/filter.dto';

//-------------------------------------------------------------------------

type SidebarRightProps = {
  className?: string;
};

export default function SidebarRight({ className }: SidebarRightProps) {
  const [activeTab, setActiveTab] = React.useState('1');
  const pathName = usePathname();
  const [followings, setFollowings] = React.useState<IFollowing[]>([]);
  const [followers, setFollowers] = React.useState<IFollower[]>([]);
  const [error, setError] = React.useState({ followers: '', followings: '' });
  const { userProfile } = useUserProfile();

  React.useEffect(() => {
    const fetchFollowersData = async () => {
      switch (activeTab) {
        case '1':
          try {
            const response = await listFollows(
              { filterBy: UserFilterByOption.LIST_FOLLOWINGS },
              { startId: 0, offset: 1, limit: 10 }
            );
            setFollowings(response.data);
          } catch (error) {
            console.error('Error fetching followings:', error);
            setError((prev) => ({
              ...prev,
              followings: 'Failed to load followings.',
            }));
          }
          break;
        case '2':
          try {
            const response = await whoToFollow();
            setFollowers(response.data);
          } catch (error) {
            console.error('Error fetching who to follow:', error);
            setError((prev) => ({
              ...prev,
              followers: 'Failed to load who to follow.',
            }));
          }
          break;
        default:
          break;
      }
    };

    fetchFollowersData();
  }, [activeTab, userProfile?.id]);

  const handleFollow = async (id: string) => {
    try {
      await followAction(id);
      setFollowings((prevFollowers) =>
        prevFollowers.map((following) => following)
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
          {error.followings ? (
            <div>{error.followings}</div>
          ) : activeTab === '1' ? (
            followings.map((user) => (
              <ProfileCard
                key={user.following.id}
                user={{
                  id: user.following.id,
                  fullname: user.following.fullname,
                  username: user.following.username,
                  photo: {
                    url: user.following.photo?.url || USER_AVATAR_PLACEHOLDER,
                  },
                  address: user.following.address,
                }}
                onFollow={() => handleFollow(user.following.id)}
              />
            ))
          ) : (
            followers.map((user) => (
              <ProfileCard
                key={user.id}
                user={{
                  id: user.id,
                  fullname: user.fullname,
                  username: user.username,
                  photo: {
                    url: user.photo?.url || USER_AVATAR_PLACEHOLDER,
                  },
                  address: user.address,
                }}
                onFollow={() => handleFollow(user.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
