import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../public/icon.png?asset'
import contextMenu from 'electron-context-menu'
import { registerUpdater } from './utils/updater'
import { existsSync, copyFileSync } from 'fs'

function createWindow(): void {
  contextMenu({
    prepend: (_, parameters) => {
      console.log(1233)
      return [
        {
          label: 'Rainbow',
          // Only show it when right-clicking images
          visible: parameters.mediaType === 'image'
        },
        {
          label: 'Search Google for “{selection}”',
          // Only show it when right-clicking text
          visible: parameters.selectionText.trim().length > 0,
          click: () => {
            shell.openExternal(
              `https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`
            )
          }
        }
      ]
    }
  })
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  const { checkIncrementalAndInstall } = registerUpdater(mainWindow)
  checkIncrementalAndInstall()
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    let loadFile = ''

    if (existsSync(join(process.resourcesPath, './renderer'))) {
      // 渲染进程不打包成asar
      loadFile = join(process.resourcesPath, './renderer/index.html')
    } else if (existsSync(join(process.resourcesPath, './renderer.asar'))) {
      // 渲染进程单独打包成asar
      loadFile = join(process.resourcesPath, './renderer.asar/index.html')
    } else {
      // 渲染进程和主进程打包在一个asar
      loadFile = join(process.resourcesPath, './app.asar/renderer/index.html')
    }
    mainWindow.loadFile(loadFile)
  }
  mainWindow.webContents.openDevTools()
}

ipcMain.on('ad', async () => {
  console.log('更新')
  console.log(
    existsSync(
      'E:\\ai\\electron-template\\release\\1.0.0\\win-unpacked\\resources\\dd\\renderer.asar'
    )
  )
  copyFileSync(
    'E:\\ai\\electron-template\\release\\1.0.0\\win-unpacked\\resources\\dd\\renderer.zip',
    'E:\\ai\\electron-template\\release\\1.0.0\\win-unpacked\\resources\\renderer.asar'
  )
  // await downloadFile(
  //   'http://localhost:3000/renderer.asar',
  //   'C:\\Users\\admin\\AppData\\Local\\electron-template-updater\\incremental\\renderer.zip'
  // )
  // renameSync(
  //   'C:\\Users\\admin\\AppData\\Local\\electron-template-updater\\incremental\\renderer.zip',
  //   'C:\\Users\\admin\\AppData\\Local\\electron-template-updater\\incremental\\renderer.asar'
  // )
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
console.log(app.getPath('appData'))
