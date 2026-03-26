import { ReactNode } from "react";
import { useNavigationHandler } from "./hooks/use-navigation-handler";

function Layout({ children }: { children: ReactNode }) {
  useNavigationHandler();

  return <div className="p-1">{children}</div>;
}

export default Layout;
