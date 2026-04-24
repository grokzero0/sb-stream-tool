import { useSettingsStore } from "@renderer/zustand/store";
import Commentators from "./Commentators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import FetchEvent from "./FetchEvent";
import Header from "./Header";
import Teams from "./Teams";
import { useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
import { Button } from "./ui/button";
import SetQuery from "./SetQuery";
import EventSets from "./EventSets";
import LiveEventSets from "./LiveEventSets";
import { useHotkey } from "@tanstack/react-hotkeys";
import { onSubmit } from "@renderer/utils/helpers";
// import { sendToastMessage } from "./ui/toast";

function Match() {
  const apiKey = useSettingsStore((state) => state.startggApiKey);
  const { handleSubmit } = useFormContext<Tournament>();
  const submitHotkey = useSettingsStore(
    (state) => state.shortcuts.get("submit") ?? "Enter",
  );

  useHotkey(submitHotkey, () => {
    handleSubmit(onSubmit)().catch((error) => console.log(error));
  });

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
      <form
        className="flex flex-col gap-2"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <div className="flex flex-col gap-2 my-2">
          <Button>UPDATE</Button>
          <SetQuery />
          <EventSets />
          <LiveEventSets />
        </div>
      </form>
    </div>
  );
}

export default Match;
