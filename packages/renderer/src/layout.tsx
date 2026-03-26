import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <div className="p-1">{children}</div>;
}

export default Layout;
