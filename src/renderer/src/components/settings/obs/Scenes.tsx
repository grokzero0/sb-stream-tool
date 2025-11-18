import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Spinbox } from '@renderer/components/ui/spinbox'
import { ObsScene } from '@renderer/lib/zustand-store/slices/obsScenesSlice'
import { useSettingsStore } from '@renderer/lib/zustand-store/store'
import { JSX, useState } from 'react'

function Scenes(): JSX.Element {
  const savedGameStartScenes = useSettingsStore((state) => state.gameStartScenes)
  const savedGameEndScenes = useSettingsStore((state) => state.gameEndScenes)
  const savedSetEndScenes = useSettingsStore((state) => state.setEndScenes)
  const update = useSettingsStore((state) => state.update)

  const [newSceneInput, setNewSceneInput] = useState({
    scene: '',
    start: 0,
    where: 'game-start'
  })

  const [gameStartScenes, setGameStartScenes] = useState<ObsScene[]>(savedGameStartScenes)
  const [gameEndScenes, setGameEndScenes] = useState<ObsScene[]>(savedGameEndScenes)
  const [setEndScenes, setSetEndScenes] = useState<ObsScene[]>(savedSetEndScenes)
  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex flex-col gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault()
          switch (newSceneInput.where) {
            case 'game-start':
              setGameStartScenes([
                ...gameStartScenes,
                {
                  scene: newSceneInput.scene,
                  start: newSceneInput.start
                }
              ])
              break
            case 'game-end':
              setGameEndScenes([
                ...gameEndScenes,
                {
                  scene: newSceneInput.scene,
                  start: newSceneInput.start
                }
              ])
              break
            case 'set-end':
              setSetEndScenes([
                ...setEndScenes,
                {
                  scene: newSceneInput.scene,
                  start: newSceneInput.start
                }
              ])
              break
            default:
              console.log('error')
          }
        }}
      >
        <h1 className="text-center font-semibold text-xl">Add Scene</h1>
        <div>
          <Label className="mb-1">Scene Name</Label>
          <Input
            required
            value={newSceneInput.scene}
            onChange={(e) =>
              setNewSceneInput({
                ...newSceneInput,
                scene: e.currentTarget.value
              })
            }
            type="text"
            placeholder="Scene Name"
          />
        </div>
        <div className="flex gap-4 w-full items-center">
          <div className="w-full">
            <Label className="mb-1">Switch to scene in seconds</Label>
            <Spinbox
              value={newSceneInput.start}
              onChangeNumber={(n) =>
                setNewSceneInput({
                  ...newSceneInput,
                  start: n
                })
              }
              placeholder="Switch in seconds"
            />
          </div>
          <div className="w-full">
            <Label className="mb-1">Switch to scene when</Label>
            <Select
              value={newSceneInput.where}
              onValueChange={(v) =>
                setNewSceneInput({
                  ...newSceneInput,
                  where: v
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="game-start">Game Starts</SelectItem>
                <SelectItem value="game-end">Game Ends</SelectItem>
                <SelectItem value="set-end">Set Ends</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full">Add Scene</Button>
      </form>
      <div className="p-4 border-2 border-cyan-200 rounded-sm">
        <h2>When a game starts, play the following scenes:</h2>
        <div className="flex gap-4 items-center"></div>
        {gameStartScenes.map((scene, index) => (
          <div className="pt-4" key={`game-start-scene-${index}`}>
            In {scene.start} seconds, switch to scene {scene.scene}
            <Button
              className="ml-4"
              onClick={() =>
                setGameStartScenes(
                  gameStartScenes.filter((_, deletionIndex) => index !== deletionIndex)
                )
              }
            >
              Delete Scene
            </Button>
          </div>
        ))}
      </div>
      <div className="p-4 border-2 border-cyan-200 rounded-sm">
        <h2>When a game ends, play the following scenes:</h2>
        {gameEndScenes.map((scene, index) => (
          <div className="pt-4" key={`game-end-scene-${index}`}>
            In {scene.start} seconds, switch to scene {scene.scene}
            <Button
              className="ml-4"
              onClick={() =>
                setGameEndScenes(
                  gameEndScenes.filter((_, deletionIndex) => index !== deletionIndex)
                )
              }
            >
              Delete Scene
            </Button>
          </div>
        ))}
      </div>
      <div className="p-4 border-2 border-cyan-200 rounded-sm">
        <h2>When a set ends, play the following scenes:</h2>
        {setEndScenes.map((scene, index) => (
          <div className="pt-4" key={`set-end-scene-${index}`}>
            In {scene.start} seconds, switch to scene {scene.scene}
            <Button
              className="ml-4"
              onClick={() =>
                setSetEndScenes(setEndScenes.filter((_, deletionIndex) => index !== deletionIndex))
              }
            >
              Delete Scene
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={() => {
          update(gameStartScenes, gameEndScenes, setEndScenes)
        }}
      >
        Update Scenes
      </Button>
    </div>
  )
}
export default Scenes
