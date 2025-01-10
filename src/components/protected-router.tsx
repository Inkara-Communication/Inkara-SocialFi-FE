'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';
import withAuth from '@/HOC/with-auth';

//-----------------------------------------------------------------------------------------------

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};

export default withAuth(ProtectedRoute);
