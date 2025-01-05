"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { analytics, logEvent } from "../utils/firebase";

export default function AnalyticsProvider() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (analytics) {
        logEvent(analytics, "page_view", { page_path: url });
      }
    };

    // Log initial page view
    handleRouteChange(window.location.pathname);

    // Listen for route changes
    router.events?.on("routeChangeComplete", handleRouteChange);

    // Cleanup on unmount
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return null; // This component does not render anything
}
