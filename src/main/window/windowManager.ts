import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../public/icon.png?asset'
import { SlideWindow } from './slideWindow'

// ----------------------------------

export class WindowManager {
  // private windows: Map<string, BrowserWindow> = new Map()
  private mainWindow: SlideWindow | null = null

  async createMainWindow() {
    let url = ''
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      // url = process.env['ELECTRON_RENDERER_URL']
      url = 'https://chatgpt.com/'
    } else {
      // const loadFile = join(process.resourcesPath, './app.asar/renderer/index.html')
      // url = loadFile
      url = 'https://chatgpt.com/'
    }

    const mainWindow = new SlideWindow({
      url: url,
      width: 800,
      height: 600,
      show: false,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      frame: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false,
        transparent: true
      }
    })
    this.mainWindow = mainWindow

    return this.mainWindow
  }
}

export const windowManager = new WindowManager()
