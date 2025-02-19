import Link from 'next/link';

import { Button } from '@/components/button';
import { Typography } from '@/components/typography';
import { AddIcon } from '@/components/icons';

import { IUserSimple } from '@/interfaces/user';

import { cn } from '@/lib/utils';

import { Avatar } from '../avatar';
import { USER_AVATAR_PLACEHOLDER } from '@/constant';

//-------------------------------------------------------------------------

interface ProfileCardProps {
  className?: string;
  user: IUserSimple;
  types?: 'follower' | 'following';
  onFollow?: () => void;
}

export default function ProfileCard({
  className,
  user,
  types,
  onFollow,
}: ProfileCardProps) {
  if (!user) return null;
  return (
    <Link href={`/profile/${user.id}`}>
      <div
        className={cn(
          'bg-neutral2-2 rounded-[1.25rem] p-3 flex flex-col justify-center gap-3 hover:bg-neutral2-5 focus:border-[3px] focus:border-neutral2-10',
          className
        )}
      >
        <div className="profile-info flex items-start gap-3">
          <div id="avatar-user" className="relative">
            <Avatar
              src={
                user.photo?.url ? user.photo?.url : USER_AVATAR_PLACEHOLDER
              }
              alt={`Avatar of ${user.fullname}`}
              className="size-[44px]"
            />
          </div>
          <div className="grow flex flex-col gap-1">
            <Typography level="base2sm" className="text-primary">
              {user.fullname}
            </Typography>
            <Typography className="text-tertiary opacity-80" level="captionr">
              {`${user.address.slice(0, 12)}...${user.address.slice(-12)}`}
            </Typography>
          </div>

          {types === 'follower' ? (
            <Button
              child={<AddIcon />}
              className="hidden md:flex rounded-full p-[10px] size-10"
              onClick={onFollow}
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
}
