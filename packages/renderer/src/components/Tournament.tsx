import { useForm } from "react-hook-form";
import { getTeamState, TournamentDefaultValues } from "../lib/form";
import { Form } from "./ui/form";
import { PlayerFormFieldArrayProvider } from "@/lib/providers";
import Header from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Teams from "./Teams";
import Commentators from "./Commentators";
import { Button } from "./ui/button";
import Query from "./Query";
import { updateOverlay } from "@app/preload";
import FetchTournament from "./FetchTournament";
import Sets from "./Sets";
function Tournament() {
  const methods = useForm({ defaultValues: TournamentDefaultValues });
  const onSubmit = (data: typeof TournamentDefaultValues) => {
    console.log(data);
    const overlayData = {
      name: data.name,
      bestOf: data.bestOf,
      roundFormat: data.roundFormat,
      customRoundFormat: data.customRoundFormat,
      roundNumber: data.roundNumber,
      setFormat: data.setFormat,
      teams: getTeamState(data.teams),
      commentators: data.commentators,
    };
    updateOverlay(overlayData);
  };
  return (
    <Form {...methods}>
      {/* Both Header and Teams require the SAME playerinfo field arrays (different arrays = different scopes, so appending or removing inputs will not be reflected in the ui), so its wrapped in a context */}
      {/* see https://github.com/react-hook-form/react-hook-form/issues/1561#issuecomment-623398286 for more details */}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PlayerFormFieldArrayProvider>
          <FetchTournament />
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
        </PlayerFormFieldArrayProvider>
        <div className="flex flex-col gap-2 my-2">
          <Button className="w-full">Update Overlay</Button>
          <Query />
          <Sets />
        </div>
      </form>
    </Form>
  );
}
export default Tournament;
