'use client';

import React, { useEffect, useState } from 'react';

import ProtectedRoute from '@/components/protected-router';

import { PostProvider } from '@/context/post-context';
import { ProfileProvider } from '@/context/user-context';
import useBreakPoint from '@/hooks/use-breakpoint';
import { SWRConfig } from 'swr';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { getPersistor } from '@rematch/persist';
import { IoProvider } from 'socket.io-react-hook';
import { Provider } from 'react-redux';

import BottomNavigationBar from '@/layouts/bottom-navigation-bar';
import Main from '@/layouts/main';
import Sidebar from '@/layouts/sidebar';
import SidebarRight from '@/layouts/sidebar-right';

import eventBus from '@/utils/event-emitter';
import { fetcher } from '@/utils/axios';
import { store } from '@/store/store';

//-----------------------------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const persistor = getPersistor();

export default function MainLayout({ children }: Props) {
  const { breakpoint } = useBreakPoint();
  const [isPostShow, setIsPostShow] = useState(false);
  const [showSidebarRight, setShowSidebarRight] = useState(true);
  const isClient = typeof window !== 'undefined';
  const [isMouted, setIsMouted] = useState(false);

  useEffect(() => {
    const handleTogglePostShow = (status: boolean) => {
      setIsPostShow(status);
    };

    const handleToggleSidebarRight = (isViewFull: boolean) => {
      setShowSidebarRight(!isViewFull);
    };

    eventBus.on('isShowCreatePost', handleTogglePostShow);
    eventBus.on('toggleSidebarRight', handleToggleSidebarRight);

    return () => {
      eventBus.off('isShowCreatePost', handleTogglePostShow);
      eventBus.off('toggleSidebarRight', handleToggleSidebarRight);
    };
  }, []);

  const isSmallScreen = isClient && breakpoint === 'sm';
  const isLargeScreen =
    isClient &&
    (breakpoint === 'lg' ||
      breakpoint === 'xl' ||
      breakpoint === '2xl' ||
      breakpoint === '3xl');

  React.useEffect(() => {
    setIsMouted(true);
  }, []);

  return (
    <ProtectedRoute>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <IoProvider>
            <SWRConfig
              value={{
                fetcher,
                dedupingInterval: 5000,
              }}
            >
              <ProfileProvider>
                <PostProvider>
                  {isMouted && (
                    <div className="h-fit bg-cushion block md:flex relative 3xl:w-[1600px] mx-auto w-full after:absolute after:inset-0 after:z-99 after:shadow-wrapper after:pointer-events-none">
                      {isSmallScreen || <Sidebar />}
                      <Main className="bg-surface">{children}</Main>
                      {isLargeScreen && showSidebarRight && <SidebarRight />}
                      {isSmallScreen && !isPostShow && <BottomNavigationBar />}
                    </div>
                  )}
                </PostProvider>
              </ProfileProvider>
            </SWRConfig>
          </IoProvider>
        </PersistGate>
      </Provider>
    </ProtectedRoute>
  );
}
