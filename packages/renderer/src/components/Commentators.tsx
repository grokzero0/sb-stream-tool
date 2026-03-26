import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Controller, useFieldArray } from "react-hook-form";
import { Input } from "./ui/input";
import { Minus, Plus } from "lucide-react";
import { Tournament } from "@app/common";

function Commentators() {
  const { fields, append, remove } = useFieldArray<Tournament>({
    name: "commentators",
  });
  return (
    <>
      <div className="flex justify-end gap-4">
        <Button
          data-icon="inline-start"
          type="button"
          onClick={() => append({ name: "", pronouns: "", twitter: "" })}
        >
          <Plus /> Add
        </Button>
        <Button
          data-icon="inline-start"
          type="button"
          onClick={() => {
            if (fields.length > 1) {
              remove(fields.length - 1);
            }
          }}
        >
          <Minus /> Subtract
        </Button>
      </div>

      {fields.map((field, commentatorNum) => (
        <div key={field.id} className="mb-4">
          <h1>Commentator {commentatorNum + 1}</h1>
          <Controller
            name={`commentators.${commentatorNum}.name`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`commentators.${commentatorNum}.name`}>
                  Name
                </FieldLabel>
                <Input {...field} id={`commentators.${commentatorNum}.name`} />
              </Field>
            )}
          ></Controller>
          <Controller
            name={`commentators.${commentatorNum}.pronouns`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`commentators.${commentatorNum}.pronouns`}>
                  Pronouns
                </FieldLabel>
                <Input
                  {...field}
                  id={`commentators.${commentatorNum}.pronouns`}
                />
              </Field>
            )}
          ></Controller>
          <Controller
            name={`commentators.${commentatorNum}.twitter`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`commentators.${commentatorNum}.twitter`}>
                  Twitter
                </FieldLabel>
                <Input
                  {...field}
                  id={`commentators.${commentatorNum}.twitter`}
                />
              </Field>
            )}
          ></Controller>
        </div>
      ))}
    </>
  );
}

export default Commentators;
