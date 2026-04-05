import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FIRST_LAUNCH_KEY = "@app_first_launch";

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const value = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      setIsFirstLaunch(value === null);
    };
    check();
  }, []);

  const markFirstLaunchDone = async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, "false");
    setIsFirstLaunch(false);
  };

  return { isFirstLaunch, markFirstLaunchDone };
}
