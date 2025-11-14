import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { SlideWindow } from './slideWindow'
import { nativeTheme, Tray, Menu, app } from 'electron'

// ----------------------------------

export class WindowManager {
  // private windows: Map<string, BrowserWindow> = new Map()
  public mainWindow: SlideWindow | null = null

  async createMainWindow() {
    let url = ''
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      url = process.env['ELECTRON_RENDERER_URL']
    } else {
      url = join(__dirname, '../renderer/index.html')
    }

    const mainWindow = new SlideWindow({
      url: url,
      width: 625,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      alwaysOnTop: false,
      frame: false,
      transparent: true,

      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false,
        transparent: true,
        webviewTag: true,
        webSecurity: false,
        contextIsolation: false,
        backgroundThrottling: false,
        nodeIntegration: true
      }
    })


    this.mainWindow = mainWindow



    const tray = new Tray(join(__dirname, '../../public/icon.png')) // 这里的 'icon.png' 替换为你的托盘图标路径

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])

    tray.setToolTip('m-fish')
    tray.setContextMenu(contextMenu)

    // 点击托盘图标时，显示主窗口
    // tray.on('click', () => {
    //   if (mainWindow.window.isVisible()) {
    //     mainWindow.hideWindow()
    //   } else {
    //     mainWindow.showWindow()
    //   }
    // })

    return this.mainWindow
  }




}

export const windowManager = new WindowManager()
