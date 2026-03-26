/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { usePlayerFormFieldArrayContext } from "@renderer/hooks/use-player-form-field-array-context";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { placements, Tournament } from "@app/common";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Spinbox } from "./ui/spinbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { changeSetFormat } from "@renderer/utils/helpers";

function Header() {
  const teams = usePlayerFormFieldArrayContext();
  const watchRoundFormat = useWatch({ name: "roundFormat" });
  const { setValue } = useFormContext<Tournament>();

  return (
    <FieldGroup className="flex flex-col gap-2">
      <Controller
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="tournament-name" className="flex justify-center text-center">
              Event Name
            </FieldLabel>
            <Input {...field} id="tournament-name" className="text-center" />
          </Field>
        )}
      ></Controller>
      <div className="flex justify-evenly items-center my-2 gap-2">
        <Controller
          name="bestOf"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-fit">
              <FieldLabel htmlFor="best-of">Best Of</FieldLabel>
              <Spinbox
                numberValue={field.value}
                onChangeNumber={field.onChange}
                id="best-of"
                min={1}
                max={100}
                {...field}
              />
            </Field>
          )}
        ></Controller>
        <div className="flex gap-2 items-center">
          <Controller
            name="roundFormat"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="round-format">Round Format</FieldLabel>
                <Select
                  value={field.value}
                  name={field.name}
                  onValueChange={(value) => {
                    if (!value.includes("Round")) {
                      setValue("roundNumber", undefined);
                    }
                    if (value !== "Custom Match") {
                      setValue("customRoundFormat", "");
                    }
                    field.onChange(value);
                  }}
                  defaultValue="Singles"
                >
                  <SelectTrigger
                    id="round-format"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {watchRoundFormat.includes("Round") && (
            <Controller
              name="roundNumber"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="round-number">Round Number</FieldLabel>
                  <Spinbox
                    numberValue={field.value}
                    onChangeNumber={field.onChange}
                    id="round-number"
                    min={0}
                    max={100}
                    {...field}
                  />
                </Field>
              )}
            />
          )}
          {watchRoundFormat == "Custom Match" && (
            <Controller
              name="customRoundFormat"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="custom-match-name">
                    Custom Round Match Name
                  </FieldLabel>
                  <Input {...field} id="custom-match-name" />
                </Field>
              )}
            />
          )}
        </div>
        <Controller
          name="setFormat"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-fit">
              <FieldLabel htmlFor="set-format">Set Format</FieldLabel>
              <Select
                value={field.value}
                name={field.name}
                onValueChange={(setFormat) => {
                  changeSetFormat(setFormat, teams);
                  field.onChange(setFormat);
                }}
                defaultValue="Singles"
              >
                <SelectTrigger
                  id="set-format"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Singles">Singles</SelectItem>
                  <SelectItem value="Doubles">Doubles</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
}

export default Header;
