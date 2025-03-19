import { app } from 'electron'
import { join, dirname } from 'path'
import axios from 'axios'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import logger from './logger'

/** 获取更新保存路径 */
export const getUpdateSavaPath = () => {
  const path = join(
    app.getPath('appData'),
    '..',
    'Local',
    `${app.getName()}-updater`,
    'incremental'
  )

  if (!existsSync(path)) {
    // 创建目录（递归创建，确保父级目录也存在）
    mkdirSync(path, { recursive: true })
  }
  return path
}

export const downloadFile = async (url: string, savePath: string) => {
  try {
    mkdirSync(dirname(savePath), { recursive: true })
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream' // 以流的形式下载
    })
    logger.info(savePath)
    response.data.pipe(createWriteStream(savePath))
    logger.info('下载文件成功')
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve(true))
      response.data.on('error', (E) => {
        logger.info(JSON.stringify(E))
        reject(false)
      })
    })
  } catch (error) {
    logger.info('下载文件失败')
    return
  }
}
