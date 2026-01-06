import { Button } from '@renderer/components/ui/button'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { JSX } from 'react'

function Slippi(): JSX.Element {
  const savedDirectory = useSettingsStore((state) => state.directory)
  const update = useSettingsStore((state) => state.updateDirectory)
  return (
    <div>
      <h1>Select directory of the .slp files:</h1>
      <Button
        type="button"
        onClick={async () => {
          const directory = await window.electronAPI.send('file:openDialog')
          update(directory)
        }}
      >
        Browse
      </Button>
      <h1>{savedDirectory === '' ? 'No directory selected.' : savedDirectory}</h1>
      <Button onClick={() => window.electronAPI.send('slippi:readDirectory', savedDirectory)}>
        Save and start reading
      </Button>
    </div>
  )
}

export default Slippi
