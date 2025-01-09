import Link from 'next/link';

import { useUserProfile } from '@/context/user-context';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Logo } from '@/components/icons';
import { CloseIcon } from '@/components/icons';
import Leave from '@/components/icons/leave';
import SettingSlider from '@/components/icons/setting-slider';
import { Typography } from '@/components/typography';

import { cn } from '@/lib/utils';

import { NAVIGATION_ITEMS } from './navigation-items';
import NavigationBar from './navigationbar';

import { USER_AVATAR_PLACEHOLDER } from '@/constant/contants';

//-------------------------------------------------------------------------

type MobileSidebarProps = {
  className?: string;
  onClose: () => void;
};

const MobileSidebar = ({ onClose, className }: MobileSidebarProps) => {
  const navItems = NAVIGATION_ITEMS;

  const { userProfile } = useUserProfile();

  return (
    <section
      className={cn(
        'md:hidden flex flex-col fixed z-99 inset-0 bg-surface-2 before:fixed before:z-0 before:inset-0 before:bg-[#313131]',
        className
      )}
    >
      <div className="flex w-full items-center justify-between p-3">
        <div className="z-99 relative">
          <Logo />
        </div>
        <Button className="p-2.5" onClick={onClose} child={<CloseIcon />} />
      </div>
      <NavigationBar
        expanded={true}
        navigationItems={navItems}
        className="flex-1 px-3"
      />
      <div className="p-3 flex flex-col gap-2 items-center justify-center">
        {userProfile && (
          <div className="flex p-1.5 gap-3 w-full items-center justify-center">
            <Avatar src={userProfile.photo?.url || USER_AVATAR_PLACEHOLDER} alt='' />

            <div className="flex flex-1 items-center bg-red-100">
              <span className="flex-grow">
                <Typography
                  level="base2sm"
                  className="text-secondary opacity-80 select-none"
                >
                  {userProfile.username}
                </Typography>
                <br />
                <Typography
                  level="captionr"
                  className="text-tertiary opacity-45 select-none"
                >
                  {`${userProfile.address.slice(0, 12)}...${userProfile.address.slice(-12)}`}
                </Typography>
              </span>
              <span className="p-1 inline-flex gap-1 z-9">
                <Link
                  href="/settings?view=account-settings"
                  className={'p-2.5'}
                >
                  <SettingSlider className="h-6 w-6 stroke-secondary hover:stroke-primary"></SettingSlider>
                </Link>
                <Link href="/login" className={'p-2.5'}>
                  <Leave className="h-6 w-6 stroke-secondary hover:stroke-primary" />
                </Link>
              </span>
            </div>
          </div>
        )}
        <Button
          className={'px-6 py-3 w-full'}
          onClick={() => {}}
          child={
            <Typography level="base2sm" className="text-secondary select-none">
              Post
            </Typography>
          }
        />
      </div>
    </section>
  );
};

export default MobileSidebar;
