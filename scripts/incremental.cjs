const AdmZip = require('adm-zip')
const path = require('path')
const asar = require('asar')

const appPath = path.resolve(__dirname, `../${path.sep}`, 'dist')
const rendererPath = path.resolve(appPath, 'renderer')
const mainPath = path.resolve(appPath, 'main')
const preloadPath = path.resolve(appPath, 'preload')

// 渲染进程不打包成asar，增量更新不重启
const unpackRenderer = () => {
  const zip = new AdmZip()
  zip.addLocalFolder(rendererPath) // 添加整个文件夹
  zip.writeZip(rendererPath + '.zip') // 生成 ZIP 文件
  console.log('文件夹压缩完成')
}

// 只更新渲染进程的asar包
const packRendererAsar = async () => {
  const zip = new AdmZip()
  const asarPath = rendererPath + '.asar'
  await asar.createPackage(rendererPath, asarPath)
  console.log('文件夹已成功压缩成 .asar 文件')
  zip.addLocalFile(asarPath)
  zip.writeZip(path.resolve(__dirname, `../${path.sep}`, 'dist', 'asar.zip'))
  console.log('文件夹压缩完成')
}

// 只更新主进程的asar包
const packMainAsar = async () => {
  const zip = new AdmZip()
  const asarPath = mainPath + '.asar'
  await asar.createPackage(mainPath, asarPath)
  console.log('文件夹已成功压缩成 .asar 文件')
  zip.addLocalFile(asarPath)
  zip.writeZip(path.resolve(__dirname, `../${path.sep}`, 'dist', 'asar.zip'))
  console.log('文件夹压缩完成')
}

// 只更新注入的asar包
const packPreloadAsar = async () => {
  const zip = new AdmZip()
  const asarPath = preloadPath + '.asar'
  await asar.createPackage(preloadPath, asarPath)
  console.log('文件夹已成功压缩成 .asar 文件')
  zip.addLocalFile(asarPath)
  zip.writeZip(path.resolve(__dirname, `../${path.sep}`, 'dist', 'asar.zip'))
  console.log('文件夹压缩完成')
}

// 更新app.asar
const packApp = async () => {
  const zip = new AdmZip()
  const asarPath = path.resolve(appPath, 'app.asar')
  await asar.createPackage(appPath, asarPath)
  console.log('文件夹已成功压缩成 .asar 文件')
  console.log(asarPath)
  zip.addLocalFile(asarPath)
  zip.writeZip(path.resolve(__dirname, `../${path.sep}`, 'dist', 'asar.zip'))
  console.log('文件夹压缩完成')
}

packRendererAsar()
