import { createLogger, transports, format } from 'winston'
import { app } from 'electron'
import path from 'path'
import 'winston-daily-rotate-file'
// 获取日志文件路径
const logDirectory = app.getPath('logs')

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, 'main', 'main.log')
    }),
    new transports.Console()
  ]
})

logger.info('创建日志文件')

export default logger
