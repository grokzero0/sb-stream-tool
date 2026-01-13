import { Label } from '@renderer/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@renderer/components/ui/radio-group'
import { JSX } from 'react'
import RelayTargetFolderBrowser from './RelayTargetFolderBrowser'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'

function Slippi(): JSX.Element {
  const relayStatus = useSettingsStore((state) => state.relayStatus)
  const updateRelayStatus = useSettingsStore((state) => state.updateRelayStatus)
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1 className="text-center font-semibold text-xl">Slippi Relay Settings</h1>
      <h2 className="text-center font-semibold text-sm">
        IMPORTANT: Manually adjusting the character info in the tournament section will STOP the
        relay!! (This is to avoid the relay automatically setting character data when you don&apos;t
        want it to/forgot to stop it!!!!)
      </h2>
      <div>
        {/* <h1></h1> */}
        <RadioGroup
          value={relayStatus}
          onValueChange={(value) => {
            updateRelayStatus(value as 'disabled' | 'folder' | 'direct')
          }}
          className="flex gap-4"
        >
          {/* <div className="flex items-center gap-3">
            <RadioGroupItem value="direct" id="r1" />
            <Label htmlFor="r1">Connect via direct connection</Label>
          </div> */}
          <div className="flex items-center gap-3">
            <RadioGroupItem value="folder" id="r2" />
            <Label htmlFor="r2">Connect via folder</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="disabled" id="r3" />
            <Label htmlFor="r3">Disabled</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <RelayTargetFolderBrowser disabled={relayStatus !== 'folder'} />
      </div>
    </div>
  )
}

export default Slippi
