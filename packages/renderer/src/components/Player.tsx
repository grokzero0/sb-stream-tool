import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useState } from "react";
import melee from "../assets/characters.json";
import { ChevronsUpDown, Square } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const borderColorVariants: { [key: string]: string } = {
  // corresponds to port
  Blue: "border-blue-500",
  Red: "border-red-500",
  Green: "border-green-500",
  Yellow: "border-yellow-500",
};

const portToColor: { [key: string]: string } = {
  0: "Red",
  1: "Blue",
  2: "Green",
  3: "Yellow",
};

const colorToPort: { [key: string]: number } = {
  Red: 1,
  Blue: 2,
  Green: 3,
  Yellow: 4,
};

function Player({
  teamNum,
  playerNum,
}: {
  teamNum: number;
  playerNum: number;
}) {
  const { setValue } = useFormContext();

  const characterSelected = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.character`,
  }) as string;
  const altCostumeSelected = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.altCostume`,
  }) as string;
  const port = useWatch({
    name: `teams.${teamNum}.players.${playerNum}.port`,
  }) as string;
  const [characterPopoverOpen, setCharacterPopoverOpen] = useState(false);

  return (
    <div
      className={`rounded-md border-2 ${borderColorVariants[port]} py-2 px-2`}
    >
      <div>
        <h6 className="text-center">Player {playerNum + 1}</h6>
        <div className="px-16 my-2">
          <Button
            type="button"
            onClick={() =>
              setValue(`teams.${teamNum}.players.${playerNum}`, {
                info: {
                  teamName: "",
                  playerTag: "",
                  pronouns: "",
                  twitter: "",
                },
                character: "Random",
                altCostume: "Default",
                port: portToColor[playerNum.toString()],
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
            name={`teams.${teamNum}.players.${playerNum}.info.teamName`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-4">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-teamName`}>
                  Team Name
                </FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-teamName`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.info.playerTag`}
            render={({ field }) => (
              <FormItem className="col-start-4 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-playerTag`}>
                  Player Tag
                </FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-playerTag`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.info.pronouns`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-4">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-pronouns`}>
                  Pronouns
                </FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-pronouns`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.info.twitter`}
            render={({ field }) => (
              <FormItem className="col-start-4 col-end-7">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-twitter`}>
                  Twitter
                </FormLabel>
                <FormControl>
                  <Input {...field} id={`${teamNum}-${playerNum}-twitter`} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={`teams.${teamNum}.players.${playerNum}.port`}
            render={({ field }) => (
              <FormItem className="col-start-7 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-port`}>
                  Port
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        id={`${teamNum}-${playerNum}-port`}
                        className="w-full"
                      >
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
            name={`teams.${teamNum}.players.${playerNum}.character`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-character`}>
                  Character
                </FormLabel>
                <Popover
                  open={characterPopoverOpen}
                  onOpenChange={setCharacterPopoverOpen}
                >
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
                                `teams.${teamNum}.players.${playerNum}.character`,
                                character
                              );
                              setValue(
                                `teams.${teamNum}.players.${playerNum}.altCostume`,
                                "Default"
                              );
                              setCharacterPopoverOpen(false);
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
            name={`teams.${teamNum}.players.${playerNum}.altCostume`}
            render={({ field }) => (
              <FormItem className="col-start-1 col-end-9">
                <FormLabel htmlFor={`${teamNum}-${playerNum}-altCostume`}>
                  Costume
                </FormLabel>
                {/* value is set here because the value is "controlled" by the characters combobox as well as this select, meaning that this is technically a controlled component */}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      id={`${teamNum}-${playerNum}-altCostume`}
                      className="w-full"
                    >
                      <SelectValue placeholder="Click for options" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {melee.altCostumes[
                      characterSelected as keyof typeof melee.altCostumes
                    ].colors.map((color: string) => (
                      <SelectItem
                        key={`${characterSelected}-${color}`}
                        value={color}
                      >
                        <img
                          src={`/characters/melee/${characterSelected.toLowerCase()}/icons/${color.toLowerCase()}.png`}
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
            src={`/characters/melee/${characterSelected.toLowerCase()}/renders/${altCostumeSelected.toLowerCase()}.png`}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
