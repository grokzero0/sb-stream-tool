import { JSX } from 'react'
import placements from '../assets/placements.json'
import { useWatch } from 'react-hook-form'
import { usePlayerFormFieldArrayContext } from '@renderer/lib/hooks'
import { FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Spinbox } from './ui/spinbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { handleSetFormatChange } from '@renderer/lib/utils'
function Header(): JSX.Element {
  const teams = usePlayerFormFieldArrayContext()
  const watchRoundFormat = useWatch({ name: 'roundFormat' })

  return (
    <>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="tournament-name" className="flex items-center justify-center mt-1">
              Tournament Name
            </FormLabel>
            <FormControl>
              <Input {...field} id="tournament-name" className="text-center" />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex justify-evenly items-center my-2">
        <FormField
          name="bestOf"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="best-of">Best Of</FormLabel>
              <FormControl>
                <Spinbox
                  numberValue={field.value}
                  onChangeNumber={field.onChange}
                  id="best-of"
                  min={0}
                  max={100}
                  {...field}
                ></Spinbox>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center">
          <FormField
            name="roundFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="round-format">Round Format</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="round-format">
                      <SelectValue placeholder="Click for options"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p.placement} value={p.placement}>
                        {p.placement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {watchRoundFormat.includes('Round') && (
            <FormField
              name="roundNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="round-number">Round Number</FormLabel>
                  <FormControl>
                    <Spinbox
                      numberValue={field.value}
                      onChangeNumber={field.onChange}
                      id="round-number"
                      min={0}
                      max={100}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          )}
          {watchRoundFormat == 'Custom Match' && (
            <FormField
              name="customRoundFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="custom-match-name">Custom Round Match Name</FormLabel>
                  <FormControl>
                    <Input {...field} id="custom-match-name" />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          name="setFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Set Format</FormLabel>
              <Select
                onValueChange={(setFormat) => {
                  handleSetFormatChange(setFormat, teams)
                  field.onChange(setFormat)
                }}
                value={field.value}
                defaultValue="Singles"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Singles">Singles</SelectItem>
                  <SelectItem value="Doubles">Doubles</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}

export default Header
