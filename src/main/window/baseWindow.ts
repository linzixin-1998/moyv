import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

export interface IBaseWindow {
  // 窗口标识
  id: string
  // BrowserWindow对象
  window: BrowserWindow
  // 初始化窗口
  initWindow: () => string
  // 显示窗口
  showWindow: () => void
  // 隐藏窗口
  hideWindow: () => void
}

export interface IBaseWindowOptions extends BrowserWindowConstructorOptions {
  id?: string
  url?: string
}

export class BaseWindow implements IBaseWindow {
  id: string
  window: BrowserWindow
  url?: string

  constructor(option: IBaseWindowOptions) {
    this.id = option.id || crypto.randomUUID()
    this.window = new BrowserWindow(option)
    this.url = option.url
    this.initWindow()
  }

  initWindow() {
    this.url &&
      this.window.loadURL(this.url).then(() => {
        this.window.focus()
      })
    this.window.on('ready-to-show', () => {
      this.window.show()
    })

    // 开发者工具
    if (import.meta.env.MODE !== 'production') {
      this.window.webContents.openDevTools()
    }
    return this.id
  }

  showWindow() {
    this.window.show()
  }
  hideWindow() {
    this.window.hide()
  }
}
