import { JSX } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import FetchTournament from './FetchTournament'
import Commentators from './Commentators'
import { Button } from './ui/button'
import Query from './Query'
import Teams from './Teams'
import Header from './Header'
import Sets from './Sets'
import LiveSets from './LiveSets'
import { useFormContext } from 'react-hook-form'

function Tournament(): JSX.Element {
  const { handleSubmit } = useFormContext()
  return (
    <form onSubmit={handleSubmit((e) => console.log(e))}>
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
      <div className="flex flex-col gap-2 my-2">
        <Button className="w-full">Update Overlay</Button>
        <Query />
        <Sets />
        <LiveSets />
      </div>
    </form>
  )
}

export default Tournament
