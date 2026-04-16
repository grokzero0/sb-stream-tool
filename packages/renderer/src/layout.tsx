import { ReactNode } from "react";
import { useNavigationHandler } from "./hooks/use-navigation-handler";
import { Toast } from "./components/ui/toast";

function Layout({ children }: { children: ReactNode }) {
  useNavigationHandler();

  return (
    <div className="p-1">
      <Toast />
      {children}
    </div>
  );
}

export default Layout;
