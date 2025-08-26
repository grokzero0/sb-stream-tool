import { Link } from "wouter";
import { Button } from "../ui/button";

function Sidebar() {
  return (
    <div className="flex flex-col gap-4 w-1/4 py-4">
      <Button asChild variant="ghost">
        <Link href="/obs">OBS</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/slippi">Slippi</Link>
      </Button>
    </div>
  );
}
export default Sidebar;