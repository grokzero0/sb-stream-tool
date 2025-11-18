import * as React from 'react'
// import { forwardRef, useState, ComponentProps } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// import { cn } from "@/lib/utils";
import { Input } from './input'

export interface SpinboxProps extends React.ComponentProps<'input'> {
  numberValue?: number
  onChangeNumber?: (numberValue: number) => void
  defaultValue?: number | undefined
  max?: number | undefined
  min?: number | undefined
  showButtons?: boolean | undefined
}

// number spinbox only (may add non-number elements in the future)
const Spinbox = React.forwardRef<HTMLInputElement, SpinboxProps>(
  (
    {
      // className,
      numberValue,
      onChangeNumber,
      max,
      min,
      showButtons = true,
      ...props
    },
    ref
  ) => {
    // the inner state of the spinbox, allows the component to be both controlled (via numberValue) and uncontrolled
    // and also syncs the state whenever someone decides to go from uncontrolled to controlled and vice versa
    const [spinboxValue, setSpinboxValue] = React.useState(props.defaultValue ?? numberValue ?? 0)

    const getNum = (num: number): number => {
      const maxNum = max ?? Number.MAX_SAFE_INTEGER
      const minNum = min ?? Number.MIN_SAFE_INTEGER
      if (Number.isNaN(num)) {
        return NaN
      }
      if (num > maxNum) {
        return maxNum
      }
      if (num < minNum) {
        return minNum
      }
      return num
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const num = getNum(e.currentTarget.valueAsNumber)
      if (onChangeNumber) {
        onChangeNumber(num)
      }
      setSpinboxValue(num)
    }

    const onButtonClick = (valueToChangeBy: number): void => {
      let num = getNum((numberValue ?? spinboxValue) + valueToChangeBy)
      if (Number.isNaN(num)) {
        if (valueToChangeBy < 0) {
          num = max ?? Number.MAX_SAFE_INTEGER
        } else {
          num = min ?? Number.MIN_SAFE_INTEGER
        }
      }
      if (onChangeNumber) {
        onChangeNumber(num)
      }
      setSpinboxValue(num)
    }

    return (
      <div className="flex items-center w-full">
        <Input
          ref={ref}
          // using shadcn's input, so className not needed
          // className={cn(
          //   "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          //   "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          //   "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          //   className
          // )}
          {...props}
          type="number"
          value={numberValue ?? spinboxValue} // ensures user never passes in value without an accompanying onChange
          onChange={onChange}
          max={max}
          min={min}
        />
        {showButtons && (
          <div className="flex flex-col">
            <button title="up-button" type="button" onClick={() => onButtonClick(1)}>
              <ChevronUp></ChevronUp>
            </button>
            <button title="down-button" type="button" onClick={() => onButtonClick(-1)}>
              <ChevronDown></ChevronDown>
            </button>
          </div>
        )}
      </div>
    )
  }
)
Spinbox.displayName = 'Spinbox'

export { Spinbox }
