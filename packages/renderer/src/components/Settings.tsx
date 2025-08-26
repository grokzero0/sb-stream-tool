import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "wouter";
import Sidebar from "./settings/sidebar";

function Settings({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  console.log(location)
  return (
    <div className="flex gap-2">
      <Sidebar />
      <div className="border-2 w-1"></div>
      <div className="w-full">
        <div className="flex justify-end p-4">
          <Button onClick={() => navigate("~")}>
            <X />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
export default Settings;
