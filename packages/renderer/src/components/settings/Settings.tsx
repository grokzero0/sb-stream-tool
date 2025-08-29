import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import SettingsSidebar from "./SettingsSidebar";

function Settings({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  console.log(location);
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex gap-2 w-full">
        <SettingsSidebar />
        <div className="w-full">
          <div className="flex justify-between items-center p-4 ">
            <SidebarTrigger />
            <Button onClick={() => navigate("~")}>
              <X />
            </Button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
export default Settings;
