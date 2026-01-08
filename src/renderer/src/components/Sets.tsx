import { JSX, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { DataTable } from './ui/data-table'
import { columns } from '@renderer/lib/types/columns'
import { RowSelectionState } from '@tanstack/react-table'
import { useLazyQuery } from '@apollo/client/react'
import { EventSetsDocument } from '@renderer/lib/queries.generated'
import { useFormContext } from 'react-hook-form'
import { changeSetFormat, filterSets, getSetFormat, sleep } from '@renderer/lib/utils'
import { SetEntry, SetTableEntry } from '@renderer/lib/types/tournament'
import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'

// TODO: filter by live sets only
function Sets(): JSX.Element {
  const { setValue, getValues } = useFormContext()
  const savedTournamentSlug = useSettingsStore((state) => state.tournamentSlug)
  const savedApiKey = useSettingsStore((state) => state.apiKey)
  const [currentTournamentSlug, setCurrentTournamentSlug] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selection, setSelection] = useState<RowSelectionState>({})
  const selectedValue = Object.keys(selection)
  const [sets, setSets] = useState([] as SetEntry[])
  const [pagesLoaded, setPagesLoaded] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [getData] = useLazyQuery(EventSetsDocument)
  const teams = usePlayerFormFieldArrayContext()
  const data = sets.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.groups[0].name,
      secondGroupName: set.groups[1].name
    }
  }) as SetTableEntry[]
  // const testData = [
  //   { stream: 'lol', matchName: '1', firstGroupName: '2', secondGroupName: '3' },
  //   { stream: 'lol', matchName: '1', firstGroupName: '2', secondGroupName: '3' },
  //   { stream: 'lol', matchName: '1', firstGroupName: '2', secondGroupName: '3' },
  //   { stream: '', matchName: '1', firstGroupName: '2', secondGroupName: '3' },
  //   { stream: '', matchName: '1', firstGroupName: '2', secondGroupName: '3' }
  // ]

  const fetchSets = async (): Promise<void> => {
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
            setSets(filterSets(data))
          } else {
            setSets((prevSets) => [...prevSets, ...filterSets(data)])
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
  // console.log(`${typeof selection}, ${selection}, ${Object.keys(selection)}`)
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
        fetchSets()
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={savedTournamentSlug === ''}>
          Choose set from {savedTournamentSlug !== '' ? savedTournamentSlug : 'tournament'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[85vw] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            Sets in {savedTournamentSlug !== '' ? savedTournamentSlug : 'tournament'}
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
export default Sets
