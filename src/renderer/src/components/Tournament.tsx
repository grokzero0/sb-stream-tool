import { JSX } from 'react'
import { Form } from './ui/form'
import { useForm } from 'react-hook-form'
import { TournamentDefaultValues } from '@renderer/lib/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { PlayerFormFieldArrayProvider } from '@renderer/lib/providers'
import FetchTournament from './FetchTournament'
import Commentators from './Commentators'
import { Button } from './ui/button'
import Query from './Query'
import Teams from './Teams'
import Header from './Header'
import Sets from './Sets'

function Tournament(): JSX.Element {
  const methods = useForm({ defaultValues: TournamentDefaultValues })

  return (
    <Form {...methods}>
      {/* Both Header and Teams require the SAME playerinfo field arrays (different arrays = different scopes, so appending or removing inputs will not be reflected in the ui), so its wrapped in a context */}
      {/* see https://github.com/react-hook-form/react-hook-form/issues/1561#issuecomment-623398286 for more details */}
      <form onSubmit={(d) => console.log(d)}>
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
          <div className="flex flex-col gap-2 my-2">
            <Button className="w-full">Update Overlay</Button>
            <Query />
            <Sets />
          </div>
        </PlayerFormFieldArrayProvider>
      </form>
    </Form>
  )
}

export default Tournament
