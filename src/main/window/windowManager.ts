import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../public/icon.png?asset'
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

      ...(process.platform === 'linux' ? { icon } : {}),
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

    nativeTheme.themeSource = 'dark'
    this.mainWindow = mainWindow

    console.log(join(__dirname, 'icon.png'))

    const tray = new Tray(icon) // 这里的 'icon.png' 替换为你的托盘图标路径

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])

    tray.setToolTip('我的 Electron 应用')
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
