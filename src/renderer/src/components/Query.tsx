import { useLazyQuery } from '@apollo/client/react'
import { SetEntrantsDocument } from '@renderer/lib/queries.generated'
import { JSX, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
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
import { changeSetFormat, getSetFormat, isInPlacementList } from '@renderer/lib/utils'
import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'

function Query(): JSX.Element {
  const [setID, setSetID] = useState('')
  const [message, setMessage] = useState('')
  const teams = usePlayerFormFieldArrayContext()
  const [getData, { loading, error }] = useLazyQuery(SetEntrantsDocument)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setValue, getValues } = useFormContext()
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined)
  const apiKey = useSettingsStore((state) => state.apiKey)

  const handleClick = async (): Promise<void> => {
    setMessage('')
    if (setID === '') {
      setMessage('Please type in a set ID')
      return
    }

    const { data } = await getData({ variables: { setId: setID } })
    if (!data) {
      return
    }
    setMessage(`Set ${setID} found! Applying information...`)
    setValue('name', data?.set?.event?.tournament?.name)

    const setFormat = getSetFormat(
      getValues('teams.0.players').length,
      data?.set?.slots?.[0]?.entrant?.participants?.length
    )
    changeSetFormat(setFormat, teams)
    setValue('setFormat', setFormat)
    const setRoundFormat = data?.set?.fullRoundText ?? 'Unknown'
    const parsedSetRoundFormat = setRoundFormat?.split(' ')
    if (
      (setRoundFormat.includes('Losers Round') || setRoundFormat.includes('Winners Round')) &&
      parsedSetRoundFormat.length === 3 // losers round 1, winners round 2, etc
    ) {
      setValue('roundFormat', `${parsedSetRoundFormat[0]} ${parsedSetRoundFormat[1]}`)
      setValue('roundNumber', parseInt(parsedSetRoundFormat[2]) ?? 0)
    } else {
      if (isInPlacementList(setRoundFormat)) {
        setValue('roundFormat', setRoundFormat)
        setValue('customRoundFormat', undefined)
      } else {
        setValue('roundFormat', 'Custom Match')
        setValue('customRoundFormat', setRoundFormat)
      }
      setValue('roundNumber', 0)
    }
    for (let i = 0; i < getValues('teams').length; i++) {
      for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
        setValue(`teams.${i}.players.${j}.playerInfo`, {
          teamName: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.prefix ?? '',
          playerTag: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.gamerTag ?? '',
          pronouns: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.user?.genderPronoun ?? '',
          twitter:
            data?.set?.slots?.[i]?.entrant?.participants?.[j]?.user?.authorizations?.[0]
              ?.externalUsername ?? ''
        })
      }
    }
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      setMessage('')
      setDialogOpen(false)
    }, 2000)
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setMessage('')
        setDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={!apiKey || apiKey === ''} className="w-full">
          Automatically fill in player data from a set
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill in player data from a set</DialogTitle>
          <DialogDescription>
            Type in the set ID of the set you want to fetch (the numbers at the end of the set URL)
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="mb-1">Set ID</Label>
          <Input value={setID} onChange={(e) => setSetID(e.currentTarget.value)} />
        </div>
        {loading && <p>Fetching information from set {setID}, please wait...</p>}
        {message}
        {error && <p>An error occurred, please try again later</p>}
        <Button type="button" onClick={handleClick}>
          Fetch Data
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default Query
