// 更新模块
import electronUpdater, { ProgressInfo, UpdateInfo, UpdateDownloadedEvent } from 'electron-updater'
import { BrowserWindow, ipcMain, app } from 'electron'
import { UPDATE_CHANNEL } from '../../common/electronChannel'
import { getUpdateSavaPath, downloadFile } from './baseUtils'
import { readdirSync, unlinkSync, existsSync } from 'fs'
import AdmZip from 'adm-zip'
import { join, basename } from 'path'
import logger from './logger'

const { autoUpdater } = electronUpdater

export const registerUpdater = (win: BrowserWindow) => {
  autoUpdater.autoInstallOnAppQuit = false
  autoUpdater.autoDownload = false
  let incrementalDownloadUrl = ''

  autoUpdater
    .on('checking-for-update', () => {
      logger.info('正在检查更新……')
    })
    .on('update-available', (info: UpdateInfo) => {
      win.webContents.send(UPDATE_CHANNEL.UPDATE_INFO, info)
      logger.info('找到最新版本')
      logger.info(JSON.stringify(info))
    })
    .on('update-not-available', async (info: UpdateInfo | any) => {
      win.webContents.send(UPDATE_CHANNEL.UPDATE_NEWEST, info)
      logger.info('没找到最新版本')
      logger.info(JSON.stringify(info))
      // todo: 判断是否有增量更新包
      if (info.incrementalUrl) {
        incrementalDownloadUrl = info.incrementalUrl
        if (existsSync(incrementalDownloadUrl)) {
          unlinkSync(incrementalDownloadUrl)
          logger.info('清空增量更新文件夹：' + incrementalDownloadUrl)
        }
        const fileName = basename(incrementalDownloadUrl)
        logger.info(incrementalDownloadUrl)
        logger.info(join(getUpdateSavaPath(), fileName))
        try {
          if (!fileName.includes('asar')) {
            await downloadFile(incrementalDownloadUrl, join(getUpdateSavaPath(), fileName))
            // zip 下载完成检查并安装
            checkIncrementalAndInstall()
            return
          } else if (fileName.includes('asar')) {
            const asarZipPath = join(getUpdateSavaPath(), fileName)
            await downloadFile(incrementalDownloadUrl, asarZipPath)
            win.webContents.send(UPDATE_CHANNEL.UPDATE_ASAR_INCREMENTAL_DOWNLOADED, {})
            app.relaunch()
            app.exit()
          }
          logger.info('增量更新下载完成')
          logger.info(incrementalDownloadUrl)
        } catch (error) {
          logger.info('下载增量更新出错')
        }
      }
    })
    .on('error', (err: Error, message?: string | undefined) => {
      win.webContents.send(UPDATE_CHANNEL.UPDATE_ERROR, err)
      logger.info('更新出错')
      logger.info('message:' + message)
      logger.info(JSON.stringify(err))
    })
    .on('download-progress', (progressObj: ProgressInfo) => {
      logger.info('正在下载...')
      logger.info(JSON.stringify(progressObj))
      win.webContents.send(UPDATE_CHANNEL.UPDATE_PROGRESS, progressObj)
    })
    .on('update-downloaded', (event: UpdateDownloadedEvent) => {
      logger.info('下载完成')
      logger.info(JSON.stringify(event))
      win.webContents.send(UPDATE_CHANNEL.UPDATE_DOWNLOADED, event)
    })

  ipcMain
    //监听检查更新事件
    .on(UPDATE_CHANNEL.CHECK_UPDATE, async () => {
      autoUpdater.checkForUpdates()
    })
    //监听安装事件
    .on(UPDATE_CHANNEL.UPDATE_SETUP, async () => {
      autoUpdater.quitAndInstall()
    })
    //监听下载新版本事件
    .on(UPDATE_CHANNEL.UPDATE_DOWNLOAD, async () => {
      autoUpdater.downloadUpdate()
    })
    .on(UPDATE_CHANNEL.UPDATE_INCREMENTAL_DOWNLOAD, async () => {
      if (existsSync(incrementalDownloadUrl)) {
        unlinkSync(incrementalDownloadUrl)
        logger.info('清空增量更新文件夹：' + incrementalDownloadUrl)
      }
      const fileName = basename(incrementalDownloadUrl)
      await downloadFile(incrementalDownloadUrl, join(getUpdateSavaPath(), fileName))
      if (incrementalDownloadUrl.endsWith('.zip')) {
        // zip 下载完成检查并安装
        checkIncrementalAndInstall()
        return
      } else {
        // asar 下载完成提示用户重启
        win.webContents.send(UPDATE_CHANNEL.UPDATE_ASAR_INCREMENTAL_DOWNLOADED, {})
        app.relaunch()
      }
    })

  // 检查是否有增量更新包并下载
  const checkIncrementalAndInstall = () => {
    const updateSavePath = getUpdateSavaPath()
    const files = readdirSync(updateSavePath)

    logger.info('存放路径：' + JSON.stringify(files))
    let updateFile
    if (!files.length) {
      return
    } else {
      updateFile = files[0]
    }

    zipIncrementalUpdate(join(updateSavePath, updateFile))
  }

  // const asarIncrementalUpdate = (asarPath: string) => {
  //   try {
  //     logger.info(asarPath)
  //     const fileName = basename(asarPath)
  //     unlinkSync(join(process.resourcesPath, fileName))
  //     logger.info('删除旧asar成功')
  //     logger.info(join(process.resourcesPath, fileName))

  //     const zipName = basename(asarPath, '.asar') + '.zip'
  //     const zipPath = join(getUpdateSavaPath(), zipName)

  //     renameSync(asarPath, zipPath)
  //     logger.info('删除旧asar成功')
  //     logger.info(zipPath)
  //     copyFileSync(zipPath, join(process.resourcesPath, fileName))
  //     logger.info('复制asar成功')
  //     unlinkSync(asarPath)
  //     logger.info('asar删除完成')
  //   } catch (error) {
  //     logger.info('复制asar出错', JSON.stringify(error))
  //   }
  // }
  const zipIncrementalUpdate = (zipPath: string) => {
    const zip = new AdmZip(zipPath) // ZIP 文件路径
    if (zipPath.includes('asar')) {
      zip.extractAllTo(process.resourcesPath, true) // true 表示覆盖已有文件
    } else {
      const folderName = basename(zipPath, '.zip')
      zip.extractAllTo(join(process.resourcesPath, folderName), true) // true 表示覆盖已有文件
    }

    logger.info('zip解压完成')
    unlinkSync(zipPath)
    logger.info('zip删除完成')
    win.webContents.send(UPDATE_CHANNEL.UPDATE_ZIP_INCREMENTAL_SUCCESS, {})
  }

  return {
    checkIncrementalAndInstall
  }
}
