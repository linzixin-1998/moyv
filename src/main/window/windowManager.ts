import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { SlideWindow } from './slideWindow'
import { BaseWindow } from './baseWindow'
import { screen, Tray, Menu, app } from 'electron'

// ----------------------------------

export class WindowManager {
  // private windows: Map<string, BrowserWindow> = new Map()
  public mainWindow: SlideWindow | null = null
  public invisibleWindow: BaseWindow | null = null
  private url = ''

  constructor() {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.url = process.env['ELECTRON_RENDERER_URL']
    } else {
      this.url = join(__dirname, '../renderer/index.html')
    }
  }

  async createMainWindow() {


    const mainWindow = new SlideWindow({
      url: this.url,
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
    const tray = new Tray(join(__dirname, '../public/icon.png')) // 这里的 'icon.png' 替换为你的托盘图标路径
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

  createInvisibleWindow() {
    const displays = screen.getAllDisplays();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const d of displays) {
      const b = d.bounds; // { x, y, width, height }
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    }
    const width = maxX - minX;
    const height = maxY - minY;

    console.log('Creating invisible window with bounds:', { minX, minY, width, height });

    const invisibleWindow = new BaseWindow({
      url: this.url + '#/invisible',
      x: minX,
      y: minY,
      width: width,
      height,
      frame: false,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: false,           // 不可聚焦（避免抢占焦点）
      skipTaskbar: true,
      alwaysOnTop: true,          // 一般使用 true，也可以使用更高层级
      hasShadow: false,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    invisibleWindow.window.setIgnoreMouseEvents(true, { forward: true });
    invisibleWindow.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    invisibleWindow.window.setAlwaysOnTop(true, 'screen-saver');

    this.invisibleWindow = invisibleWindow
    invisibleWindow.window.setBounds({
      x: minX,
      y: minY,
      width: width,
      height: height
    });

  }
}

export const windowManager = new WindowManager()
