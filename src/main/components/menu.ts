import { BrowserWindow, Menu, shell } from 'electron'
import { ObsController } from '../ObsController'

const highlights = [
  'https://clips.twitch.tv/VainVivaciousCurlewDoubleRainbow-tg-LUGc37J6inQSy',
  'https://www.youtube.com/watch?v=t7W4NJjfFMg',
  'https://www.youtube.com/watch?v=pufA00QrXog',
  'https://youtube.com/clip/UgkxH4VbrDOQnpExz-8sbLwkZ2q6HEi76SIR?si=Hcxq0aohT4-MXnza',
  'https://clips.twitch.tv/SwissLaconicShieldArgieB8-FbMqt_VJsnvfWGGo',
  'https://www.youtube.com/clip/UgkxF_0841f-FwMJ_T40xSr_0fjl5IdxOSbj',
  'https://www.youtube.com/watch?v=ljrIkINkawM',
  'https://www.youtube.com/watch?v=Uu9Kpyi5qG4',
  'https://www.youtube.com/watch?v=uyup7rN_7ko',
  'https://www.youtube.com/watch?v=rEtbBQnU_Xk',
  'https://clips.twitch.tv/SpoopyObservantWrenchArsonNoSexy-0GCrZ0iQbeT3k7ck',
  'https://clips.twitch.tv/DelightfulCaringNigiriPlanking-y5U74CH5MP9uv3Nn'
]

export function buildMenu(browserWindow: BrowserWindow, obs: ObsController): Electron.Menu {
  const menu = Menu.buildFromTemplate([
    // {
    //   label: "Game (Not implemented yet lol)",
    //   submenu: [
    //     {
    //       label: "Melee",
    //       click: () => browserWindow.webContents.send("swap-to-game", "melee"),
    //       type: "radio",
    //     },
    //     {
    //       label: "P+",
    //       click: () => browserWindow.webContents.send("swap-to-game", "p+"),
    //       type: "radio",
    //     },
    //     {
    //       label: "etc",
    //       click: () => browserWindow.webContents.send("swap-to-game", "etc"),
    //       type: "radio",
    //     },
    //   ],
    // },
    {
      label: 'File',
      submenu: [
        {
          label: 'Settings',
          click: () => browserWindow.webContents.send('navigation', 'settings')
        },
        {
          role: 'quit'
        }
      ]
    },
    {
      label: 'OBS',
      submenu: [
        {
          label: 'Play game start scenes',
          click: () => obs.playScenes('game-start'),
          accelerator: 'Control+F1'
        },
        {
          label: 'Play game end scenes',
          click: () => obs.playScenes('game-end'),
          accelerator: 'Control+F2'
        },
        {
          label: 'Play set end scenes',
          click: () => obs.playScenes('set-end'),
          accelerator: 'Control+F3'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: () =>
            shell.openExternal(
              'https://clips.twitch.tv/VainVivaciousCurlewDoubleRainbow-tg-LUGc37J6inQSy'
            ),
          accelerator: 'Control+F11'
        },
        {
          label: 'Actually Learn More',
          click: () =>
            shell.openExternal(highlights[Math.floor(Math.random() * highlights.length)]),
          accelerator: 'Control+F12'
        }
      ]
    }
  ])
  return menu
}
