import Commentators from "./Commentators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import SetQuery from "./SetQuery";

function Match() {
  return (
    <form>
      <Tabs defaultValue="players">
        <TabsList className="w-full">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="commentators">Commentators</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <>player</>
        </TabsContent>
        <TabsContent value="commentators">
          <Commentators />
        </TabsContent>
      </Tabs>
    </form>
  );
}

export default Match;
