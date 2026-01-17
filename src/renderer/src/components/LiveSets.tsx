import { useLazyQuery } from '@apollo/client/react'
import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'
import { LiveEventSetsDocument } from '@renderer/lib/queries.generated'
import { SetEntry, SetTableEntry } from '@renderer/lib/types/tournament'
import { changeSetFormat, filterLiveSets, getSetFormat, sleep } from '@renderer/lib/utils'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { RowSelectionState } from '@tanstack/react-table'
import { JSX, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DataTable } from './ui/data-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { columns } from '@renderer/lib/types/columns'

function LiveSets(): JSX.Element {
  const { setValue, getValues } = useFormContext()
  const savedApiKey = useSettingsStore((state) => state.apiKey)
  const savedTournamentSlug = useSettingsStore((state) => state.tournamentSlug)
  const [currentTournamentSlug, setCurrentTournamentSlug] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selection, setSelection] = useState<RowSelectionState>({})
  const [pagesLoaded, setPagesLoaded] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const selectedValue = Object.keys(selection)
  const [sets, setSets] = useState([] as SetEntry[])
  const teams = usePlayerFormFieldArrayContext()
  const [getData] = useLazyQuery(LiveEventSetsDocument)

  const data = sets.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.groups[0].name,
      secondGroupName: set.groups[1].name
    }
  }) as SetTableEntry[]

  const fetchLiveSets = async (): Promise<void> => {
    let pages = 1
    for (let i = 1; i <= pages; i++) {
      let requestsLimitExceeded = false
      do {
        if (requestsLimitExceeded) {
          await sleep(60000)
        }
        const { data, error } = await getData({
          variables: {
            eventSlug: savedTournamentSlug,
            page: i,
            perPage: 50
          }
        })
        if (!data || error) {
          requestsLimitExceeded = true
        } else {
          requestsLimitExceeded = false
          setCurrentTournamentSlug(savedTournamentSlug)
          if (i == 1) {
            // first page loaded should overwrite previous sets, the first page loaded also should set all information
            setPagesLoaded(0)
            pages = data.event!.sets!.pageInfo!.totalPages!
            setTotalPages(pages)
            setSets(filterLiveSets(data))
          } else {
            setSets((prevSets) => [...prevSets, ...filterLiveSets(data)])
          }
          setPagesLoaded((pages) => pages + 1)
        }
      } while (requestsLimitExceeded === true)
    }
  }
  const applySet = (): void => {
    const selected = parseInt(Object.keys(selection)[0])
    if (Number.isNaN(selected) || sets[selected].groups.length <= 0) {
      return
    }
    const setFormat = getSetFormat(
      getValues('teams.0.players').length,
      sets[selected].groups[0].players.length // all sets are assured to have the same size
    )
    changeSetFormat(setFormat, teams)
    setValue('setFormat', setFormat)
    for (let i = 0; i < getValues('teams').length; i++) {
      for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
        setValue(`teams.${i}.players.${j}.playerInfo`, {
          teamName: sets[selected].groups[i].players[j].teamName,
          playerTag: sets[selected].groups[i].players[j].playerTag,
          pronouns: sets[selected].groups[i].players[j].pronouns,
          twitter: sets[selected].groups[i].players[j].twitter
        })
      }
    }
    setDialogOpen(false)
  }
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={async (open) => {
        setDialogOpen(open)
        if (
          open == false ||
          savedTournamentSlug === '' ||
          currentTournamentSlug === savedTournamentSlug
        ) {
          return
        }
        fetchLiveSets()
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={savedTournamentSlug === ''}>
          Choose live set from {savedTournamentSlug !== '' ? savedTournamentSlug : 'tournament'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[85vw] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            Live sets in {savedTournamentSlug !== '' ? savedTournamentSlug : 'tournament'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!savedApiKey && (
            <h1>
              YOU MUST PUT IN A START.GG API KEY (GO TO SETTINGS FOR TUTORIAL) IN ORDER TO USE THIS
            </h1>
          )}
          <h1>
            Pages {pagesLoaded} of {totalPages} loaded
          </h1>
          <DataTable
            columns={columns}
            data={data}
            setSelection={setSelection}
            pagination={true}
            multiRows={false}
            className="max-h-[60vh] overflow-auto"
          />
          <Button type="button" disabled={selectedValue.length <= 0} onClick={applySet}>
            Apply this set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default LiveSets
