
import { useState, useEffect } from "react";

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstLaunch = () => {
      const hasLaunched = localStorage.getItem("app_has_launched");
      if (!hasLaunched) {
        setIsFirstLaunch(true);
        return true;
      }
      return false;
    };

    const isFirst = checkFirstLaunch();
    setIsLoading(false);

    return () => {
      // Mark as launched only when unmounting if it was the first launch
      if (isFirst) {
        localStorage.setItem("app_has_launched", "true");
      }
    };
  }, []);

  return { isFirstLaunch, isLoading };
};
