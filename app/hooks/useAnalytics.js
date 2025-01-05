"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { analytics, logEvent } from './utils/firebase';

const useAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (analytics) {
        logEvent(analytics, 'page_view', { page_path: url });
      }
    };

    // Log the initial page view
    handleRouteChange(window.location.pathname);

    // Subscribe to route changes
    router.events?.on('routeChangeComplete', handleRouteChange);

    // Cleanup on unmount
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
};

export default useAnalytics;
