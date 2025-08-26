import { navigation } from "@app/preload";
import { useLocation } from "wouter";

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  navigation((location) => {
    // console.log(location);
    navigate(`/${location}`);
  });
  return <>{children}</>;
}

export default NavigationHandler;
