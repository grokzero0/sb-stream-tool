import { clearAllListeners, navigation } from "@app/preload";
import { useEffect } from "react";
import { useLocation } from "wouter";

export function useNavigationHandler() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigation((location) => {
      navigate(`/${location}`);
    });
    return () => clearAllListeners("navigation");
  }, [navigate]);
}
