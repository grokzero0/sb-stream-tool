import { JSX, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { DataTable } from './ui/data-table'
import { columns } from '@renderer/lib/types/columns'
import { RowSelectionState } from '@tanstack/react-table'
import { useLazyQuery } from '@apollo/client/react'
import { EventSetsDocument } from '@renderer/lib/queries.generated'
import { useFormContext } from 'react-hook-form'
import { filterSets, updatePlayerForm } from '@renderer/lib/utils'
import { SetEntry, SetTableEntry } from '@renderer/lib/types/tournament'
import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'

const sleep = (ms: number): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, ms))

function Sets(): JSX.Element {
  const { setValue, getValues } = useFormContext()
  const savedTournamentSlug = useSettingsStore((state) => state.tournamentSlug)
  const [currentTournamentSlug, setCurrentTournamentSlug] = useState('')
  const requestsMade = useRef(0)
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
        setPagesLoaded(0)
        setCurrentTournamentSlug(currentTournamentSlug)
        if (requestsMade.current >= 80) {
          await sleep(60000)
          requestsMade.current = 0
        }
        const { data } = await getData({
          variables: { eventSlug: savedTournamentSlug, page: 1, perPage: 50 }
        })
        if (!data) {
          return
        }
        setSets(filterSets(data))
        setPagesLoaded(1)
        const pages = data.event!.sets!.pageInfo!.totalPages!
        setTotalPages(pages)

        requestsMade.current += 1
        // if data exists, you can safely assume the totalPages information does exist
        for (let i = 2; i < pages; i++) {
          if (requestsMade.current >= 80) {
            await sleep(60000)
            requestsMade.current = 0
          }
          const { data } = await getData({
            variables: {
              eventSlug: savedTournamentSlug,
              page: i,
              perPage: 50
            }
          })
          if (data) {
            setSets((prevData) => [...prevData, ...filterSets(data)])
            requestsMade.current += 1
            setPagesLoaded(i)
          }
        }
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
          <Button
            type="button"
            disabled={selectedValue.length <= 0}
            onClick={() => {
              const selected = parseInt(Object.keys(selection)[0])
              if (Number.isNaN(selected)) {
                return
              }
              if (sets[selected].groups.length <= 0) {
                return
              }
              const setFormat = updatePlayerForm(
                getValues('teams.0.players').length,
                sets[selected].groups[0].players.length, // all sets are assured to have the same size
                teams,
                getValues('setFormat')
              )
              setValue('setFormat', setFormat)
              for (let i = 0; i < getValues('teams').length; i++) {
                for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
                  setValue(`teams.${i}.players.${j}.info`, {
                    teamName: sets[selected].groups[i].players[j].teamName,
                    playerTag: sets[selected].groups[i].players[j].playerTag,
                    pronouns: sets[selected].groups[i].players[j].pronouns,
                    twitter: sets[selected].groups[i].players[j].twitter
                  })
                }
              }
              setDialogOpen(false)
            }}
          >
            Apply this set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default Sets
