import { app } from 'electron'
import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

export default async function createDirs(): Promise<void> {
  let resourcesPath = path.join(app.getAppPath(), '..', 'resources')
  let configPath = path.join(app.getAppPath(), '..', 'config')
  let overlayPath = `${app.getAppPath()}/packages/renderer/src/assets/overlay/`
  let charactersPath = `${app.getAppPath()}/packages/renderer/src/assets/characters/`
  if (process.env.NODE_ENV !== 'development') {
    overlayPath = `${process.resourcesPath}/overlay/`
    charactersPath = `${process.resourcesPath}/characters/`
    switch (process.platform) {
      case 'win32': {
        resourcesPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR as string, 'resources')
        configPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR as string, 'config')
        break
      }
      default: {
        console.log()
      }
    }
  }

  cp(overlayPath, `${path.join(resourcesPath, 'overlay')}`, {
    recursive: true
  })
  cp(charactersPath, `${path.join(resourcesPath, 'characters')}`, {
    recursive: true
  })
  mkdir(`${path.join(resourcesPath, 'texts', 'commentators')}`, {
    recursive: true
  })
  mkdir(`${path.join(resourcesPath, 'texts', 'teams')}`, {
    recursive: true
  })
  mkdir(configPath, { recursive: true })
}
