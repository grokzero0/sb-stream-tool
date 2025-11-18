import { JSX } from 'react'
import { useFieldArray } from 'react-hook-form'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import { Label } from './ui/label'
import { FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'

function Commentators(): JSX.Element {
  const { fields, append, remove } = useFieldArray({ name: 'commentators' })
  return (
    <>
      <div className="flex justify-end gap-4">
        <Button type="button" onClick={() => append({ name: '', pronouns: '', twitter: '' })}>
          <Plus />
          Add
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (fields.length > 1) {
              remove(fields.length - 1)
            }
          }}
        >
          <Minus /> Subtract
        </Button>
      </div>
      {fields.map((field, commentatorNum) => (
        <div key={field.id} className="mb-4">
          <Label>Commentator {commentatorNum + 1}</Label>
          <div className="flex flex-col gap-2 mt-2">
            <FormField
              name={`commentators.${commentatorNum}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`commentators.${commentatorNum}.name`}>Name</FormLabel>
                  <FormControl>
                    <Input {...field} id={`commentators.${commentatorNum}.name`}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name={`commentators.${commentatorNum}.pronouns`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`commentators.${commentatorNum}.pronouns`}>
                    Pronouns
                  </FormLabel>
                  <FormControl>
                    <Input {...field} id={`commentators.${commentatorNum}.pronouns`}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name={`commentators.${commentatorNum}.twitter`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`commentators.${commentatorNum}.twitter`}>Twitter</FormLabel>
                  <FormControl>
                    <Input {...field} id={`commentators.${commentatorNum}.twitter`}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default Commentators
