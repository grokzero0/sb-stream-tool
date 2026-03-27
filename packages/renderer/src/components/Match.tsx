import { useSettingsStore } from "@renderer/zustand/store";
import Commentators from "./Commentators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import FetchEvent from "./FetchEvent";
import Header from "./Header";
import Teams from "./Teams";
// import SetQuery from "./SetQuery";

function Match() {
  const apiKey = useSettingsStore((state) => state.apiKey);
  return (
    <div className="flex flex-col gap-2">
      {apiKey === "" && (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>
            You must have a start.gg api key in order to use the automated set
            fetching tools (go to settings to set it!)
          </AlertTitle>
        </Alert>
      )}
      <form className="flex flex-col gap-2">
        <FetchEvent />
        <Header />
        <Tabs defaultValue="players">
          <TabsList className="w-full">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="commentators">Commentators</TabsTrigger>
          </TabsList>
          <TabsContent value="players">
            <Teams />
          </TabsContent>
          <TabsContent value="commentators">
            <Commentators />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

export default Match;
