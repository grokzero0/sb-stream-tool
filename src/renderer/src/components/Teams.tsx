import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'
import { JSX } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from './ui/button'
import { FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Spinbox } from './ui/spinbox'
import { Switch } from './ui/switch'
import Player from './Player'

function Teams(): JSX.Element {
  const { setValue } = useFormContext()
  const { fields, swap } = useFieldArray({ name: 'teams' })
  const players = usePlayerFormFieldArrayContext()

  return (
    <>
      <div className="px-8 py-1">
        <Button type="button" onClick={() => swap(0, 1)} className="mb-2 w-full">
          Swap Teams
        </Button>
      </div>
      <div className="flex gap-1">
        {fields.map((teamItem, teamNum) => (
          <div
            key={teamItem.id}
            className="rounded-md border-dotted border-2 border-gray-500 py-2 px-2 w-full"
          >
            <h5 className="text-center">Team {teamNum + 1}</h5>
            <div className="flex items-center justify-evenly mb-2">
              <FormField
                name={`teams.${teamNum}.score`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Spinbox
                        numberValue={field.value}
                        onChangeNumber={field.onChange}
                        min={0}
                        max={100}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => setValue(`teams.${teamNum}.score`, 0)}>
                Reset Score
              </Button>
              <FormField
                name={`teams.${teamNum}.inLosers`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>In Losers</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              {players[teamNum].fields.map((playerItem, playerNum) => (
                <Player key={playerItem.id} teamNum={teamNum} playerNum={playerNum} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Teams
