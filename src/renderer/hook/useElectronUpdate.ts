import { onMounted, onBeforeUnmount, ref } from 'vue'
import { UPDATE_CHANNEL } from '@/common/electronChannel'
import { getSizeStr } from '@/renderer/utils/baseUtils'

let checkoutCallback: any = null

/**
 *
 * @returns {
 *    onCheckVersion: 检查是否有新版本
 *    downloadNewVersion: 下载新版本
 *    downloading: 是否正在下载
 *    progress: 下载进度
 *    downloadSpeed: 下载速度
 *    fileSize: 文件大小
 *    isDownloaded: 是否下载完成
 * }
 */
export const useElectronUpdate = () => {
  const downloading = ref(false)
  const progress = ref(0)
  const downloadSpeed = ref('0 B')
  const fileSize = ref('0 B')
  const isDownloaded = ref(false)
  const ipcRenderer = window.electron.ipcRenderer

  const foundNewVersion = (_, info) => {
    if (checkoutCallback) {
      checkoutCallback(true, info)
    }
  }

  const noFoundNewVersion = (_, info) => {
    console.log(info)
    if (checkoutCallback) {
      checkoutCallback(false, info)
    }
  }

  const onCheckVersion = (callback: (hasNew: boolean, info: any) => void) => {
    console.log(callback)

    checkoutCallback = callback
  }

  const updateError = (_, err) => {
    console.info('更新出错')
    console.info(JSON.stringify(err))
    console.log(checkoutCallback)
    if (checkoutCallback) {
      checkoutCallback(false, err)
    }
  }

  const downloadProgress = (_, progressObj) => {
    console.info('正在下载...')
    console.info(JSON.stringify(progressObj))
    progress.value = parseInt(progressObj.percent)
    downloadSpeed.value = getSizeStr(progressObj.bytesPerSecond)
    fileSize.value = getSizeStr(progressObj.total)
    isDownloaded.value = true
  }

  const downloadCompleted = (_, info) => {
    console.info('下载完成')
    console.info(JSON.stringify(info))
    ipcRenderer.send(UPDATE_CHANNEL.UPDATE_SETUP)
  }

  const checkNewVersion = () => {
    ipcRenderer.send(UPDATE_CHANNEL.CHECK_UPDATE, import.meta.env.MODE)
  }
  const downloadNewVersion = () => {
    ipcRenderer.send(UPDATE_CHANNEL.UPDATE_DOWNLOAD)
    downloading.value = true
  }

  onMounted(() => {
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_INFO, foundNewVersion)
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_NEWEST, noFoundNewVersion)
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_ERROR, updateError)
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_PROGRESS, downloadProgress)
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_DOWNLOADED, downloadCompleted)
    ipcRenderer.on(UPDATE_CHANNEL.UPDATE_ZIP_INCREMENTAL_SUCCESS, () => {
      window.location.reload()
    })
  })

  onBeforeUnmount(() => {
    ipcRenderer.removeAllListeners(UPDATE_CHANNEL.UPDATE_INFO)
    ipcRenderer.removeAllListeners(UPDATE_CHANNEL.UPDATE_NEWEST)
    ipcRenderer.removeAllListeners(UPDATE_CHANNEL.UPDATE_ERROR)
    ipcRenderer.removeAllListeners(UPDATE_CHANNEL.UPDATE_PROGRESS)
    ipcRenderer.removeAllListeners(UPDATE_CHANNEL.UPDATE_DOWNLOADED)
  })

  return {
    downloading,
    progress,
    downloadSpeed,
    fileSize,
    onCheckVersion,
    checkNewVersion,
    downloadNewVersion
  }
}
