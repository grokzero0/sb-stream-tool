import { Button } from '@renderer/components/ui/button'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { JSX } from 'react'

function RelayTargetFolderBrowser({ disabled }: { disabled: boolean }): JSX.Element {
  const savedDirectory = useSettingsStore((state) => state.directory)
  const update = useSettingsStore((state) => state.updateDirectory)
  return (
    <div className="flex items-center flex-col gap-4  border-2 border-cyan-200 rounded-sm p-4 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-center font-semibold text-xl">Connect to relay manually</h1>
        <h2 className="text-center">
          Note: This option is for those who are connecting to the console via Slippi Launcher, etc
        </h2>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-center font-semibold">Select target folder:</h1>
          <div className="flex gap-4 items-center justify-center ">
            <Button
              type="button"
              disabled={disabled}
              onClick={async () => {
                const directory = await window.electronAPI.send('file:openDialog')
                update(directory)
              }}
            >
              Browse
            </Button>
            <h1>{savedDirectory === '' ? 'No directory selected.' : savedDirectory}</h1>
          </div>
        </div>
        <div className="flex gap-2 w-full justify-center">
          <Button
            disabled={disabled}
            type="button"
            // className="w-full"
            onClick={() => window.electronAPI.send('slippi:readFolder', savedDirectory)}
          >
            Save and start reading
          </Button>
          <Button
            type="button"
            onClick={() => window.electronAPI.send('slippi:stopReadingFolder')}
            disabled={disabled}
          >
            Stop
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RelayTargetFolderBrowser
