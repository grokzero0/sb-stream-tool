import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { JSX, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'

function FetchTournament(): JSX.Element {
  const savedTournamentUrl = useSettingsStore((state) => state.tournamentUrl)
  const update = useSettingsStore((state) => state.updateTournamentUrl)
  const [tournamentUrl, setTournamentUrl] = useState(savedTournamentUrl)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button className="w-full mb-1">Set Tournament</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Tournament URL</DialogTitle>
          <DialogDescription>
            Type in the Start.gg tournament url (has the /event/ after it)
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>URL</Label>
          <Input value={tournamentUrl} onChange={(e) => setTournamentUrl(e.currentTarget.value)} />
        </div>
        <Button
          type="button"
          onClick={() => {
            update(tournamentUrl)
            setDialogOpen(false)
          }}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default FetchTournament
