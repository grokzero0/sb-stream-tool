import { JSX, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Button } from './ui/button'
import { FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ChevronsUpDown, Square } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './ui/command'

import melee from '../assets/characters.json'
import { portToColor } from '@renderer/lib/utils'

const borderColorVariants: { [key: string]: string } = {
  // corresponds to port
  Blue: 'border-blue-500',
  Red: 'border-red-500',
  Green: 'border-green-500',
  Yellow: 'border-yellow-500'
}

const colorToPort: { [key: string]: number } = {
  Red: 1,
  Blue: 2,
  Green: 3,
  Yellow: 4
}

function Player({ teamNum, playerNum }: { teamNum: number; playerNum: number }): JSX.Element {
  const { setValue } = useFormContext()

  const characterSelected = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.gameInfo.character`
  }) as string
  const altCostumeSelected = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.gameInfo.altCostume`
  }) as string
  const port = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.gameInfo.port`
  }) as string
  const [characterPopoverOpen, setCharacterPopoverOpen] = useState(false)
  console.log(
    `team ${teamNum}, player ${playerNum}, altCostume = ${altCostumeSelected}, character = ${characterSelected}`
  )
  return (
    <div className={`rounded-md border-2 ${borderColorVariants[port]} py-2 px-2`}>
      <div>
        <h6 className="text-center">Player {playerNum + 1}</h6>
        <div className="px-16 my-2">
          <Button
            type="button"
            onClick={() =>
              setValue(`teams.${teamNum}.players.${playerNum}`, {
                playerInfo: {
                  teamName: '',
                  playerTag: '',
                  pronouns: '',
                  twitter: ''
                },
                gameInfo: {
                  character: 'Random',
                  altCostume: 'Default',
                  port: portToColor[playerNum + 1]
                }
              })
            }
            className="w-full"
          >
            Clear Info
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-full grid grid-cols-8 gap-x-2 gap-y-3">
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.playerInfo.teamName`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-4">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-teamName`}>Team Name</FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-teamName`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.playerInfo.playerTag`}
            render={({ field }) => (
              <FormItem className="col-start-4 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-playerTag`}>Player Tag</FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-playerTag`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.playerInfo.pronouns`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-4">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-pronouns`}>Pronouns</FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-pronouns`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.playerInfo.twitter`}
            render={({ field }) => (
              <FormItem className="col-start-4 col-end-7">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-twitter`}>Twitter</FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-twitter`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.gameInfo.port`}
            render={({ field }) => (
              <FormItem className="col-start-7 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-port`}>Port</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger id={`${teamNum}-${playerNum}-port`} className="w-full">
                        <SelectValue aria-label={field.value}>
                          {colorToPort[field.value]}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Red">
                        <Square fill="red" /> 1
                      </SelectItem>
                      <SelectItem value="Blue">
                        <Square fill="blue" /> 2
                      </SelectItem>
                      <SelectItem value="Green">
                        <Square fill="green" /> 3
                      </SelectItem>
                      <SelectItem value="Yellow">
                        <Square fill="yellow" /> 4
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.gameInfo.character`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-character`}>Character</FormLabel>
                <Popover open={characterPopoverOpen} onOpenChange={setCharacterPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        defaultValue="Random"
                        id={`${teamNum}-${playerNum}-character`}
                      >
                        {field.value}
                        <ChevronsUpDown />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="Search for characters"></CommandInput>
                      <CommandList>
                        <CommandEmpty>No character found</CommandEmpty>
                        {melee.characters.map((character) => (
                          <CommandItem
                            value={character}
                            key={character}
                            onSelect={() => {
                              setValue(
                                `teams.${teamNum}.players.${playerNum}.gameInfo.character`,
                                character
                              )
                              setValue(
                                `teams.${teamNum}.players.${playerNum}.gameInfo.altCostume`,
                                'Default'
                              )
                              setCharacterPopoverOpen(false)
                            }}
                          >
                            {character}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.gameInfo.altCostume`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-altCostume`}>Costume</FormLabel>
                {/* value is set here because the value is "controlled" by the characters combobox as well as this select, meaning that this is technically a controlled component */}
                <Select
                  onValueChange={(e) => {
                    // https://github.com/radix-ui/primitives/issues/3068
                    if (e === '') return
                    field.onChange(e)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger id={`${teamNum}-${playerNum}-altCostume`} className="w-full">
                      <SelectValue placeholder="Click for options" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {melee.altCostumes[
                      characterSelected as keyof typeof melee.altCostumes
                    ].colors.map((color: string, index) => (
                      <SelectItem key={`characterSelected-color-${index}`} value={color}>
                        <img
                          src={
                            new URL(
                              `../assets/characters/melee/${characterSelected.toLowerCase()}/icons/${color.replace(/\s/g, '').toLowerCase()}.png`,
                              import.meta.url
                            ).href
                          }
                          width={28}
                          height={28}
                        />
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <div className="w-3/5 flex items-center">
          <img
            src={
              new URL(
                `../assets/characters/melee/${characterSelected.toLowerCase()}/renders/${altCostumeSelected.replace(/\s/g, '').toLowerCase()}.png`,
                import.meta.url
              ).href
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Player
