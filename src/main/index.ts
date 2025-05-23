import { app, BrowserWindow, WebContents } from 'electron'

import { electronApp, optimizer } from '@electron-toolkit/utils'

import { windowManager } from './window/windowManager'

import { setupContextMenu } from './utils/webviewMenu'

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

  windowManager.createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) windowManager.createMainWindow()
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

// 初始化webview菜单
app.on('web-contents-created', (...[_event, webContents]: [Electron.Event, WebContents]) => {
  setupContextMenu(webContents)
  webContents.setWindowOpenHandler(({ url }) => {
    webContents.loadURL(url)
    return { action: 'deny' }
  })
})
