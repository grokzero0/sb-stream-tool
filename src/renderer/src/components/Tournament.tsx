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
import { getTeamState } from '@renderer/lib/form'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { Alert, AlertTitle } from './ui/alert'
import { AlertCircleIcon } from 'lucide-react'

function Tournament(): JSX.Element {
  const { handleSubmit } = useFormContext()
  const apiKey = useSettingsStore((state) => state.apiKey)
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data)
        const overlayData = {
          name: data.name,
          bestOf: data.bestOf,
          roundFormat: data.roundFormat,
          customRoundFormat: data.customRoundFormat,
          roundNumber: data.roundNumber,
          setFormat: data.setFormat,
          teams: getTeamState(data.teams),
          commentators: data.commentators
        }
        window.electronAPI.updateOverlay(overlayData)
      })}
    >
      {apiKey === '' && (
        <Alert className="my-2">
          <AlertCircleIcon />
          <AlertTitle>
            You must have a start.gg api key in order to use the automated set fetching tools (go to
            settings to set it!)
          </AlertTitle>
        </Alert>
      )}
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
